import type { MetaFunction } from '@remix-run/cloudflare';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  Server,
  Database,
  Globe,
  Shield,
  Smartphone,
  CreditCard,
  MessageSquare,
  BarChart3,
  Zap,
  RefreshCw,
} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Status Layanan - Santri Online' },
    {
      name: 'description',
      content: 'Pantau status real-time layanan Santri Online dan riwayat uptime sistem.',
    },
  ];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function StatusPage() {
  // Overall status: operational, degraded, outage

  const services = [
    {
      name: 'Website Utama',
      description: 'Portal utama Santri Online',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '285ms',
      icon: Globe,
    },
    {
      name: 'API Server',
      description: 'Backend services dan API',
      status: 'operational',
      uptime: '99.95%',
      responseTime: '120ms',
      icon: Server,
    },
    {
      name: 'Database',
      description: 'Primary database cluster',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '45ms',
      icon: Database,
    },
    {
      name: 'Sistem Hafalan',
      description: 'Tracking hafalan Al-Quran',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '180ms',
      icon: CheckCircle,
    },
    {
      name: 'Marketplace',
      description: 'Platform jual beli karya',
      status: 'operational',
      uptime: '99.94%',
      responseTime: '220ms',
      icon: Activity,
    },
    {
      name: 'Dompet Digital',
      description: 'Sistem pembayaran DinCoin/DirCoin',
      status: 'operational',
      uptime: '99.96%',
      responseTime: '95ms',
      icon: CreditCard,
    },
    {
      name: 'Forum Komunitas',
      description: 'Diskusi dan interaksi santri',
      status: 'operational',
      uptime: '99.93%',
      responseTime: '160ms',
      icon: MessageSquare,
    },
    {
      name: 'Mobile App',
      description: 'Aplikasi mobile Santri Online',
      status: 'maintenance',
      uptime: '99.91%',
      responseTime: 'N/A',
      icon: Smartphone,
    },
    {
      name: 'CDN & Media',
      description: 'Content delivery network',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '55ms',
      icon: Zap,
    },
    {
      name: 'Security Services',
      description: 'Authentication & security',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '30ms',
      icon: Shield,
    },
  ];

  const incidents = [
    {
      id: 1,
      title: 'Scheduled Maintenance - Mobile App',
      description: 'Pemeliharaan rutin aplikasi mobile untuk peningkatan performa',
      status: 'investigating',
      severity: 'low',
      startTime: '2024-01-15 02:00 WIB',
      expectedEnd: '2024-01-15 06:00 WIB',
      affectedServices: ['Mobile App'],
      updates: [
        {
          time: '2024-01-15 02:00 WIB',
          message: 'Maintenance dimulai sesuai jadwal. Estimasi selesai pukul 06:00 WIB.',
          status: 'investigating',
        },
      ],
    },
    {
      id: 2,
      title: 'Minor API Latency Issues',
      description: 'Peningkatan latency pada beberapa endpoint API',
      status: 'resolved',
      severity: 'low',
      startTime: '2024-01-14 14:30 WIB',
      endTime: '2024-01-14 15:45 WIB',
      affectedServices: ['API Server', 'Marketplace'],
      updates: [
        {
          time: '2024-01-14 15:45 WIB',
          message: 'Issue telah teratasi. Semua layanan kembali normal.',
          status: 'resolved',
        },
        {
          time: '2024-01-14 15:20 WIB',
          message: 'Tim teknis sedang menerapkan fix. Progress: 80%',
          status: 'monitoring',
        },
        {
          time: '2024-01-14 14:45 WIB',
          message: 'Root cause teridentifikasi. Sedang mempersiapkan fix.',
          status: 'investigating',
        },
        {
          time: '2024-01-14 14:30 WIB',
          message: 'Monitoring mendeteksi peningkatan latency pada API server.',
          status: 'investigating',
        },
      ],
    },
  ];

  const metrics = [
    {
      name: 'Overall Uptime',
      value: '99.96%',
      period: '30 hari terakhir',
      trend: 'up',
      icon: BarChart3,
    },
    {
      name: 'Avg Response Time',
      value: '145ms',
      period: '24 jam terakhir',
      trend: 'stable',
      icon: Clock,
    },
    {
      name: 'Active Users',
      value: '12,547',
      period: 'Real-time',
      trend: 'up',
      icon: Activity,
    },
    {
      name: 'Incidents',
      value: '2',
      period: '7 hari terakhir',
      trend: 'down',
      icon: AlertCircle,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'outage':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded';
      case 'outage':
        return 'Outage';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'major':
        return 'bg-orange-100 text-orange-800';
      case 'minor':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'monitoring':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-primary/10 via-blue-50 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Activity className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Status{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Layanan
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Monitor real-time status semua layanan Santri Online
            </p>

            {/* Overall Status */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-lg border shadow-sm">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold">Semua Sistem Berjalan Normal</span>
              <Badge className="bg-green-100 text-green-800 border-green-200">Operational</Badge>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {new Date().toLocaleString('id-ID')}
              <RefreshCw className="w-4 h-4 inline ml-2" />
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Key Metrics */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">Key Metrics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <metric.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl font-bold mb-1">{metric.value}</div>
                    <div className="text-sm font-medium mb-2">{metric.name}</div>
                    <div className="text-xs text-muted-foreground">{metric.period}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Services Status */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-8">Status Layanan</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{service.name}</h3>
                          <Badge className={getStatusColor(service.status)}>
                            {getStatusText(service.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Uptime: </span>
                            <span className="font-medium">{service.uptime}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Response: </span>
                            <span className="font-medium">{service.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Incidents */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-8">Recent Incidents</h2>

          {incidents.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold mb-2">Tidak Ada Incident</h3>
                <p className="text-muted-foreground">
                  Semua layanan berjalan normal tanpa gangguan berarti dalam 30 hari terakhir.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {incidents.map((incident) => (
                <motion.div key={incident.id} variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{incident.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {incident.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity.toUpperCase()}
                          </Badge>
                          <Badge className={getIncidentStatusColor(incident.status)}>
                            {incident.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-muted-foreground">Affected Services:</span>
                          {incident.affectedServices.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-sm space-y-1">
                          <div>
                            <span className="text-muted-foreground">Started: </span>
                            <span className="font-medium">{incident.startTime}</span>
                          </div>
                          {incident.endTime && (
                            <div>
                              <span className="text-muted-foreground">Resolved: </span>
                              <span className="font-medium">{incident.endTime}</span>
                            </div>
                          )}
                          {incident.expectedEnd && !incident.endTime && (
                            <div>
                              <span className="text-muted-foreground">Expected End: </span>
                              <span className="font-medium">{incident.expectedEnd}</span>
                            </div>
                          )}
                        </div>

                        {/* Updates Timeline */}
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium mb-3">Updates</h4>
                          <div className="space-y-3">
                            {incident.updates.map((update, index) => (
                              <div key={index} className="flex gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs text-muted-foreground">
                                      {update.time}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {update.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm">{update.message}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Stay Updated Info */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-blue-100 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-foreground">Status Layanan Real-time</h3>
              <p className="text-foreground mb-6 max-w-2xl mx-auto">
                Pantau status layanan kami secara real-time. Semua sistem dipantau 24/7 untuk
                memastikan kualitas pembelajaran terbaik.
              </p>
              <p className="text-sm text-foreground">
                Untuk informasi lebih lanjut tentang pemeliharaan atau gangguan, silakan hubungi tim
                support kami.
              </p>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
