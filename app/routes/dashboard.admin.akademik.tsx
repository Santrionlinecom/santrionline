import * as React from 'react';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Plus, BookOpen, Users, Layers, Settings } from 'lucide-react';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireAdminUserId } = await import('~/lib/session.server');
  await requireAdminUserId(request, context);
  return json({ ok: true });
}

export default function AdminAkademikPage() {
  // Placeholder state (nanti diganti data loader DB)
  const courses = [
    { id: 'crs-1', title: 'Hafalan Juz 1', modules: 8, participants: 42, status: 'aktif' },
    { id: 'crs-2', title: 'Tajwid Dasar', modules: 12, participants: 58, status: 'aktif' },
    { id: 'crs-3', title: 'Fiqh Ibadah', modules: 10, participants: 33, status: 'draft' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Akademik - Admin</h1>
            <p className="text-muted-foreground">Kelola kursus, modul, dan peserta pembelajaran</p>
          </div>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Kursus Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Kursus</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-3"><BookOpen className="w-8 h-8 text-primary" /><span className="text-3xl font-bold">{courses.length}</span></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Peserta Aktif</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-3"><Users className="w-8 h-8 text-green-600" /><span className="text-3xl font-bold">{courses.reduce((a,c)=>a+c.participants,0)}</span></CardContent>
          </Card>
            <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Modul Total</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-3"><Layers className="w-8 h-8 text-purple-600" /><span className="text-3xl font-bold">{courses.reduce((a,c)=>a+c.modules,0)}</span></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Kursus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map(course => (
                <div key={course.id} className="border rounded-lg p-4 hover:shadow-sm transition">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold leading-tight line-clamp-2 pr-2">{course.title}</h3>
                    <Badge variant={course.status === 'aktif' ? 'default' : 'secondary'}>{course.status}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-4 mb-4">
                    <span>{course.modules} modul</span>
                    <span>{course.participants} peserta</span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <Button variant="outline" size="sm" className="flex-1">Kelola</Button>
                    <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}