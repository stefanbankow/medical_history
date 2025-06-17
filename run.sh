#!/bin/bash

# Medical History System Docker Compose Script

echo "🏥 Medical History System - Docker Setup"
echo "========================================"

# Function to check if docker and docker-compose are installed
check_dependencies() {
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    echo "✅ Docker and Docker Compose are installed"
}

# Function to build and start the application
start_application() {
    echo "🔧 Building and starting the application..."
    docker-compose up --build -d
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Application started successfully!"
        echo ""
        echo "📝 Access Information:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend API: http://localhost:8080/api"
        echo "   PostgreSQL: localhost:5432"
        echo ""
        echo "🔑 Default Login Credentials:"
        echo "   Username: admin"
        echo "   Password: admin123"
        echo ""
        echo "📊 To view logs: docker-compose logs -f"
        echo "🛑 To stop: docker-compose down"
        echo ""
    else
        echo "❌ Failed to start the application"
        exit 1
    fi
}

# Function to stop the application
stop_application() {
    echo "🛑 Stopping the application..."
    docker-compose down
    echo "✅ Application stopped"
}

# Function to show application status
show_status() {
    echo "📊 Application Status:"
    docker-compose ps
}

# Function to show logs
show_logs() {
    echo "📋 Application Logs:"
    docker-compose logs -f
}

# Function to reset everything (remove containers and volumes)
reset_application() {
    echo "🔄 Resetting application (removing containers and volumes)..."
    docker-compose down -v
    docker-compose rm -f
    echo "✅ Application reset complete"
}

# Main menu
case "$1" in
    start)
        check_dependencies
        start_application
        ;;
    stop)
        stop_application
        ;;
    restart)
        stop_application
        sleep 2
        check_dependencies
        start_application
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    reset)
        reset_application
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|reset}"
        echo ""
        echo "Commands:"
        echo "  start   - Build and start the application"
        echo "  stop    - Stop the application"
        echo "  restart - Restart the application"
        echo "  status  - Show application status"
        echo "  logs    - Show application logs"
        echo "  reset   - Remove all containers and volumes"
        echo ""
        exit 1
        ;;
esac
