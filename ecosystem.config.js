module.exports = {
  apps: [{
    name: 'api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '1G',
    exp_backoff_restart_delay: 100,
    watch: false,
    max_restarts: 10,
    restart_delay: 4000,
    autorestart: true,
    vizion: false
  }]
}
