# Claude Code Configuration for TravelPlanner

This document contains Claude Code configuration and context for the TravelPlanner project.

## MCP Servers Configured ✅

The following MCP (Model Context Protocol) servers are successfully configured and operational:

- **✅ linear-server**: Linear project management integration (Connected)
- **✅ filesystem**: Secure file system operations with directory access
- **✅ memory**: Knowledge graph-based context persistence across Claude sessions  
- **✅ github**: GitHub repository operations with API authentication
- **✅ postgres**: PostgreSQL database operations with TravelPlanner database

### MCP Setup Details

**Filesystem Server**:
- Package: `@modelcontextprotocol/server-filesystem`
- Access Directories: `/Users/hernanpablogarcia/web-projects`, `/Users/hernanpablogarcia/Desktop`
- Status: Fully operational for secure file operations

**Memory Server**:
- Package: `@modelcontextprotocol/server-memory`
- Type: Knowledge graph-based persistent memory
- Status: Ready for context persistence across sessions

**GitHub Server**:
- Package: `@missionsquad/mcp-github`
- Authentication: Personal Access Token configured
- Permissions: Repository access, issues, pull requests
- Status: Connected and authenticated

**PostgreSQL Server**:
- Package: `mcp-postgres-server`
- Database: `travelplanner` (Production), `travelplanner_test` (Testing)
- Connection: `postgresql://user:pass@localhost:5432/travelplanner`
- PostgreSQL Version: 14.18 (Homebrew)
- Status: Database installed, configured, and operational

## Project Context

- **Current Status**: Successfully deployed simplified version to Render + Complete MCP setup
- **Architecture**: FastAPI backend + React frontend + PostgreSQL database
- **Deployment**: Using simplified implementation with mock data (Phase 1)
- **Database**: PostgreSQL 14 installed and configured for Phase 2
- **Development Tools**: Full MCP integration for enhanced development workflow
- **Next Phase**: Migrate from mock data to PostgreSQL database integration

## Development Commands

```bash
# Start backend (simplified version)
cd backend && uvicorn app.main_simple:app --reload --port 8000

# Start backend with database (Phase 2)
cd backend && uvicorn app.main:app --reload --port 8000

# Start frontend  
cd frontend && npm run dev

# Database operations
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
brew services start postgresql@14  # Start PostgreSQL
psql -U user -h localhost -d travelplanner  # Connect to database

# Run tests
cd backend && pytest
cd frontend && npm test

# Deploy (auto-deploys on push to main)
git push origin main

# MCP Debug (verify all servers)
claude --debug
```

## Linear Integration

This project uses Linear for project management via MCP server integration:
- **MCP Connection**: Direct integration with Linear API through Claude Code
- **Current Focus**: Foundation setup complete, moving to database integration (Phase 2)
- **Epic 1 Status**: Successfully completed simplified deployment
- **Next Epic**: Database integration and data persistence
- **MCP Benefits**: Seamless ticket management, status updates, and project tracking from Claude

## Important Files

- `backend/app/main_simple.py`: Current production backend (simplified)
- `backend/app/main.py`: Full-featured backend with database (Phase 2 ready)
- `backend/app/main_simple_db.py`: Database-connected version for testing
- `backend/app/core/database.py`: Database configuration and connection management
- `backend/app/core/config.py`: Application settings with database configuration
- `CONTEXT_PRESERVATION_DEPLOYMENT.md`: Complete deployment context
- `render.yaml`: Render deployment configuration
- `.mcp.json`: Local MCP server configuration
- `~/.claude.json`: Global MCP server configuration

## MCP Setup Complete ✅

**Date**: July 22, 2025  
**Status**: All MCP servers successfully installed and configured  
**Database**: PostgreSQL 14 installed and TravelPlanner databases created  
**Integration**: Full Claude Code MCP workflow operational  
**Next Steps**: Begin Phase 2 database integration development