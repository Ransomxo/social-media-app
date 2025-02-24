# DigitalOcean Deployment Guide

## Prerequisites
1. DigitalOcean account with appropriate permissions
2. Domain configured (api.omniposting.com) with DNS records pointing to DigitalOcean
3. Environment variables prepared:
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=           # Neon.tech PostgreSQL connection string
   JWT_SECRET=            # Secure random string
   ENCRYPTION_KEY=        # 32-byte encryption key
   SENTRY_DSN=           # Sentry project DSN
   OPENAI_API_KEY=       # OpenAI API key
   SMTP_HOST=            # SMTP server host
   SMTP_PORT=            # SMTP server port
   SMTP_SECURE=          # SMTP TLS (true/false)
   SMTP_USER=            # SMTP username
   SMTP_PASS=            # SMTP password
   SMTP_FROM=            # From email address
   ```

## Initial Setup

### 1. Create Droplet
1. Log into DigitalOcean dashboard
2. Create new Ubuntu 22.04 LTS droplet:
   - Size: Basic (CPU-optimized)
   - 4GB RAM / 2 vCPUs minimum
   - Enable monitoring
   - Choose datacenter region closest to users
   - Add SSH key for secure access

### 2. Configure DNS
1. Add A record for api.omniposting.com pointing to droplet IP
2. Wait for DNS propagation (can take up to 24 hours)

### 3. Initial Server Setup
1. SSH into the droplet:
   ```bash
   ssh root@your_droplet_ip
   ```

2. Create deployment user:
   ```bash
   adduser deploy
   usermod -aG sudo deploy
   ```

3. Set up SSH for deploy user:
   ```bash
   mkdir -p /home/deploy/.ssh
   cp ~/.ssh/authorized_keys /home/deploy/.ssh/
   chown -R deploy:deploy /home/deploy/.ssh
   chmod 700 /home/deploy/.ssh
   chmod 600 /home/deploy/.ssh/authorized_keys
   ```

4. Run setup script:
   ```bash
   ./scripts/setup-droplet.sh
   ```

## Deployment

### Manual Deployment
1. Push changes to main branch:
   ```bash
   git push origin main
   ```

2. SSH into droplet:
   ```bash
   ssh deploy@api.omniposting.com
   ```

3. Navigate to application directory:
   ```bash
   cd /var/www/api.omniposting.com
   ```

4. Pull latest changes:
   ```bash
   git pull origin main
   ```

5. Run deployment script:
   ```bash
   ./scripts/deploy.sh
   ```

### Automated Deployment (GitHub Actions)
1. Add GitHub secrets:
   - `DIGITALOCEAN_ACCESS_TOKEN`
   - `DEPLOY_SSH_KEY`
   - All environment variables listed in prerequisites

2. Push to main branch - deployment will start automatically

## Monitoring

### Application Logs
- PM2 logs:
  ```bash
  pm2 logs api              # Live logs
  pm2 logs api --lines 100  # Last 100 lines
  ```
- Application logs: `/home/deploy/logs/`
  - `error.log`: Error-level messages
  - `combined.log`: All application logs

### System Logs
- Nginx logs:
  - Access logs: `/var/log/nginx/api.omniposting.com-access.log`
  - Error logs: `/var/log/nginx/api.omniposting.com-error.log`

### Performance Monitoring
- PM2 Monitoring:
  ```bash
  pm2 monit                 # Real-time monitoring
  pm2 status               # Process status
  ```
- Sentry Dashboard: https://sentry.io/
  - Error tracking
  - Performance monitoring
  - User impact analysis

### Health Checks
1. API Status:
   ```bash
   curl https://api.omniposting.com/health
   ```

2. SSL Certificate:
   ```bash
   curl -vI https://api.omniposting.com
   ```

## Maintenance

### SSL Certificate Renewal
Certbot will automatically renew certificates. Manual renewal if needed:
```bash
sudo certbot renew
```

### Database Backups
Neon.tech handles automated backups. Manual backup if needed:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Log Rotation
Logrotate is configured to handle log rotation automatically:
- Application logs: Daily rotation, 14 days retention
- Nginx logs: Daily rotation, 14 days retention

## Troubleshooting

### Common Issues
1. Application not starting:
   ```bash
   pm2 logs api
   journalctl -u pm2-deploy
   ```

2. Nginx issues:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. SSL issues:
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

### Emergency Rollback
1. Find last working commit:
   ```bash
   git log --oneline
   ```

2. Revert to previous version:
   ```bash
   git checkout <commit-hash>
   ./scripts/deploy.sh
   ```

## Security

### Firewall Rules
The following ports are open:
- 22 (SSH)
- 80 (HTTP - redirects to HTTPS)
- 443 (HTTPS)

### SSL Configuration
- TLS 1.2 and 1.3 only
- Strong cipher suite
- HSTS enabled
- Regular certificate renewal

### Rate Limiting
- Global API: 1000 requests per IP per hour
- Authentication endpoints: 20 requests per IP per minute
- Social media endpoints: 100 requests per IP per minute
