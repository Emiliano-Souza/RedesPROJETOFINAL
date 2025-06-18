@echo off
echo Rebuilding and starting containers...

REM Stop and remove containers
docker-compose down

REM Build and start containers
docker-compose up -d --build

echo Done! Services are running at:
echo - Frontend: http://localhost:8000
echo - API: http://localhost:8000/api
echo - MinIO Console: http://localhost:9001 (login: minio_user / minio_password)

echo.
echo Press any key to exit...
pause > nul