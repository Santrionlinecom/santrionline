@echo off
echo Setting up Community Feed with dummy data...

echo 1. Running database migration...
call setup-community-feed.bat

echo 2. Inserting dummy data...
wrangler d1 execute santri-db --file="seed-community-data.sql"

echo 3. Verifying data...
wrangler d1 execute santri-db --command="SELECT COUNT(*) as posts_count FROM posts;"
wrangler d1 execute santri-db --command="SELECT COUNT(*) as comments_count FROM comments;"
wrangler d1 execute santri-db --command="SELECT COUNT(*) as likes_count FROM likes;"

echo 4. Testing feed data...
wrangler d1 execute santri-db --command="SELECT p.content, u.name as author FROM posts p LEFT JOIN pengguna u ON p.author_id = u.id ORDER BY p.created_at DESC LIMIT 3;"

echo Community feed setup with dummy data complete!
echo.
echo You can now:
echo - Visit /community to see the feed
echo - Create new posts with images
echo - Like, comment, and share posts
echo - Test infinite scroll
echo.
pause
