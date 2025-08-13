import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { getDb } from "~/db/drizzle.server";
import { biolink_analytics, user as userTable } from "~/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  
  if (!username) {
    return json({ error: 'Username required' }, { status: 400 });
  }

  const db = getDb(context);

  // Get user by username
  const user = await db.query.user.findFirst({
    where: eq(userTable.username, username),
    columns: { id: true, name: true, isPublic: true },
  });

  if (!user || !user.isPublic) {
    return json({ error: 'User not found or not public' }, { status: 404 });
  }

  // Get analytics data for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateString = thirtyDaysAgo.toISOString().split('T')[0];

  const analytics = await db.query.biolink_analytics.findMany({
    where: and(
      eq(biolink_analytics.userId, user.id),
      sql`${biolink_analytics.date} >= ${dateString}`
    ),
    orderBy: [biolink_analytics.date],
  });

  // Calculate totals
  const totalVisitors = analytics.reduce((sum, record) => sum + (record.visitorCount || 0), 0);
  const totalClicks = analytics.reduce((sum, record) => sum + (record.clickCount || 0), 0);

  return json({
    user: { name: user.name },
    analytics,
    totals: {
      visitors: totalVisitors,
      clicks: totalClicks,
    },
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { username, type } = await request.json() as { username: string; type: string };
  
  if (!username || !type) {
    return json({ error: 'Username and type required' }, { status: 400 });
  }

  const db = getDb(context);

  // Get user by username
  const user = await db.query.user.findFirst({
    where: eq(userTable.username, username),
    columns: { id: true, isPublic: true },
  });

  if (!user || !user.isPublic) {
    return json({ error: 'User not found or not public' }, { status: 404 });
  }

  const today = new Date().toISOString().split('T')[0];

  // Check if analytics record exists for today
  const existingRecord = await db.query.biolink_analytics.findFirst({
    where: and(
      eq(biolink_analytics.userId, user.id),
      eq(biolink_analytics.date, today)
    ),
  });

  if (existingRecord) {
    // Update existing record
    const updateData = type === 'visit' 
      ? { visitorCount: sql`${biolink_analytics.visitorCount} + 1` }
      : { clickCount: sql`${biolink_analytics.clickCount} + 1` };

    await db.update(biolink_analytics)
      .set(updateData)
      .where(eq(biolink_analytics.id, existingRecord.id));
  } else {
    // Create new record
    const initialData = type === 'visit' 
      ? { visitorCount: 1, clickCount: 0 }
      : { visitorCount: 0, clickCount: 1 };

    await db.insert(biolink_analytics).values({
      id: crypto.randomUUID(),
      userId: user.id,
      ...initialData,
      date: today,
      createdAt: new Date(),
    });
  }

  return json({ success: true });
}
