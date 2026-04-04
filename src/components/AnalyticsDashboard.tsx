import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Brain, Database, 
  Activity, Target, Award, AlertCircle, RefreshCw, FileText, CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AnalyticsService } from '@/services/analytics.service';

interface DashboardStats {
  totalPredictions: number;
  averageSuccessRate: number;
  topPerformingRoles: string[];
  trendingSkills: string[];
  recentActivity: number;
  totalAnalyses: number;
  averageScore: number;
  modelStats: any;
  auditStats: any;
  // New AI Resume Intelligence stats
  resumeScore?: {
    latestScore: number;
    componentScores: { skills: number; projects: number; experience: number; education: number };
    qualityFlag: string;
    recommendations: string[];
    scoreHistory: Array<{ date: string; score: number }>;
  };
  skillMatch?: {
    matchScore: number;
    weightedMatchScore: number;
    matchQuality: string;
    matchedSkills: string[];
    missingSkills: string[];
    targetRole: string;
  };
}

interface ChartData {
  rolePerformance: Array<{ role: string; successRate: number; predictions: number }>;
  skillTrends: Array<{ skill: string; demand: number; trend: string }>;
  activityTrend: Array<{ date: string; analyses: number; predictions: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
  // New AI Resume Intelligence chart data
  componentScores?: Array<{ component: string; score: number; weight: number }>;
  skillDistribution?: Array<{ category: string; count: number }>;
  scoreImprovement?: Array<{ date: string; score: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B9D', '#C084FC'];

// Demo data for when database is unavailable
const DEMO_STATS: DashboardStats = {
  totalPredictions: 247,
  averageSuccessRate: 0.78,
  topPerformingRoles: [
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'ML Engineer',
    'Frontend Developer'
  ],
  trendingSkills: [
    'React', 'Python', 'TypeScript', 'AWS', 'Docker', 
    'Kubernetes', 'Node.js', 'PostgreSQL'
  ],
  recentActivity: 23,
  totalAnalyses: 189,
  averageScore: 76,
  modelStats: {
    averageAccuracy: 0.85,
    totalModels: 3,
    activeModels: 2
  },
  auditStats: {
    totalLogs: 1247
  },
  // New AI Resume Intelligence demo data
  resumeScore: {
    latestScore: 82,
    componentScores: {
      skills: 85,
      projects: 78,
      experience: 80,
      education: 88
    },
    qualityFlag: 'excellent',
    recommendations: [
      'Add more technical projects to showcase skills',
      'Include quantifiable achievements in experience section',
      'Consider adding certifications to boost credibility'
    ],
    scoreHistory: [
      { date: '2024-01-01', score: 65 },
      { date: '2024-01-15', score: 72 },
      { date: '2024-02-01', score: 75 },
      { date: '2024-02-15', score: 78 },
      { date: '2024-03-01', score: 82 }
    ]
  },
  skillMatch: {
    matchScore: 75,
    weightedMatchScore: 78,
    matchQuality: 'Good',
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    missingSkills: ['Kubernetes', 'AWS', 'GraphQL'],
    targetRole: 'Full Stack Developer'
  }
};

export function AnalyticsDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isDemoMode, setIsDemoMode] = useState(true);

  const loadChartData = async (stats: DashboardStats) => {
    try {
      // Generate role performance data
      const rolePerformance = stats.topPerformingRoles.slice(0, 5).map((role, index) => ({
        role: role.length > 15 ? role.substring(0, 15) + '...' : role,
        successRate: Math.round((0.9 - index * 0.1) * 100),
        predictions: Math.floor(Math.random() * 50) + 10
      }));

      // Generate skill trends data
      const skillTrends = stats.trendingSkills.slice(0, 8).map((skill, index) => ({
        skill: skill.length > 12 ? skill.substring(0, 12) + '...' : skill,
        demand: Math.floor(Math.random() * 40) + 60,
        trend: index < 3 ? 'rising' : index < 6 ? 'stable' : 'declining'
      }));

      // Generate activity trend (last 7 days)
      const activityTrend = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          analyses: Math.floor(Math.random() * 20) + 5,
          predictions: Math.floor(Math.random() * 15) + 3
        };
      });

      // Generate score distribution
      const scoreDistribution = [
        { range: '0-20%', count: Math.floor(Math.random() * 5) + 1 },
        { range: '21-40%', count: Math.floor(Math.random() * 10) + 3 },
        { range: '41-60%', count: Math.floor(Math.random() * 15) + 8 },
        { range: '61-80%', count: Math.floor(Math.random() * 20) + 12 },
        { range: '81-100%', count: Math.floor(Math.random() * 15) + 5 }
      ];

      // NEW: Generate component scores data
      const componentScores = stats.resumeScore ? [
        { component: 'Skills', score: stats.resumeScore.componentScores.skills, weight: 40 },
        { component: 'Projects', score: stats.resumeScore.componentScores.projects, weight: 25 },
        { component: 'Experience', score: stats.resumeScore.componentScores.experience, weight: 20 },
        { component: 'Education', score: stats.resumeScore.componentScores.education, weight: 15 }
      ] : [];

      // NEW: Generate skill distribution by category
      const skillDistribution = stats.skillMatch ? [
        { category: 'Programming Languages', count: 3 },
        { category: 'Frameworks', count: 2 },
        { category: 'Databases', count: 1 },
        { category: 'DevOps', count: 1 },
        { category: 'Cloud', count: 0 }
      ] : [];

      // NEW: Score improvement over time
      const scoreImprovement = stats.resumeScore?.scoreHistory || [];

      setChartData({
        rolePerformance,
        skillTrends,
        activityTrend,
        scoreDistribution,
        componentScores,
        skillDistribution,
        scoreImprovement
      });

    } catch (err) {
      console.error('Chart data generation error:', err);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[Analytics] Loading dashboard in Demo Mode...');
      
      // DEMO MODE: Use static demo data - no database or API calls
      // Simulate realistic loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set demo data
      setStats(DEMO_STATS);
      setIsDemoMode(true);

      // Generate chart data from demo stats
      await loadChartData(DEMO_STATS);
      
      setLastUpdated(new Date());
      console.log('[Analytics] ✅ Demo data loaded successfully');
      
    } catch (err) {
      console.error('[Analytics] Error loading dashboard:', err);
      // Set user-friendly error message
      setError('Unable to load analytics. Using demo mode.');
      // Still set demo data even on error
      setStats(DEMO_STATS);
      setIsDemoMode(true);
      await loadChartData(DEMO_STATS);
    } finally {
      // Always stop loading
      setLoading(false);
      console.log('[Analytics] Loading complete');
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-light">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Loading Analytics Dashboard...</p>
              <p className="text-sm text-muted-foreground">Preparing demo data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-light">
        <div className="max-w-7xl mx-auto p-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Dashboard Error</span>
              </div>
              <p className="text-red-600 mt-2">{error}</p>
              <Button onClick={handleRefresh} className="mt-4" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-light">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">
                Advanced Analytics Dashboard
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time insights and performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {isDemoMode && (
              <Badge variant="secondary" className="px-3 py-1 bg-yellow-100 text-yellow-800">
                Demo Mode
              </Badge>
            )}
            <Badge variant="secondary" className="px-3 py-1">
              <Database className="w-4 h-4 mr-2" />
              {isDemoMode ? 'Demo Data' : 'Live Data'}
            </Badge>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalPredictions || 0}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +{stats?.recentActivity || 0} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((stats?.averageSuccessRate || 0) * 100)}%
              </div>
              <Progress value={(stats?.averageSuccessRate || 0) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAnalyses || 0}</div>
              <p className="text-xs text-muted-foreground">
                Avg Score: {Math.round(stats?.averageScore || 0)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((stats?.modelStats?.averageAccuracy || 0) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.modelStats?.totalModels || 0} models active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* NEW: AI Resume Intelligence Metrics */}
        {stats?.resumeScore && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resume Score</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {stats.resumeScore.latestScore}
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>
                <div className="mt-2">
                  <Badge 
                    variant="secondary" 
                    className={
                      stats.resumeScore.qualityFlag === 'excellent' ? 'bg-green-100 text-green-800' :
                      stats.resumeScore.qualityFlag === 'competitive' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {stats.resumeScore.qualityFlag.charAt(0).toUpperCase() + stats.resumeScore.qualityFlag.slice(1)}
                  </Badge>
                </div>
                <Progress value={stats.resumeScore.latestScore} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Skill Match</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {stats.skillMatch?.weightedMatchScore || 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.skillMatch?.matchedSkills.length || 0} skills matched
                </p>
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {stats.skillMatch?.matchQuality || 'N/A'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Target Role</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-purple-600">
                  {stats.skillMatch?.targetRole || 'Not Set'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.skillMatch?.missingSkills.length || 0} skills to learn
                </p>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 mr-1 text-purple-600" />
                  <span>Focus on missing skills</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Role Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Role Performance Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Success rates by target role
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData?.rolePerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="successRate" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Trends</CardTitle>
              <p className="text-sm text-muted-foreground">
                Daily analyses and predictions
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData?.activityTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="analyses" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="predictions" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* NEW: AI Resume Intelligence Charts */}
        {stats?.resumeScore && chartData?.componentScores && (
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Component Scores Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Component Scores</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Breakdown by skills, projects, experience, education
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.componentScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="component" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#0088FE" name="Score" />
                    <Bar dataKey="weight" fill="#00C49F" name="Weight %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Score Improvement Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Score Improvement Trend</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Resume score progress over time
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.scoreImprovement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ fill: '#8884d8', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* NEW: Skill Distribution Pie Chart */}
        {stats?.skillMatch && chartData?.skillDistribution && (
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution by Category</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your skills organized by category
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.skillDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, count }) => `${category}: ${count}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {chartData.skillDistribution.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Missing Skills Card */}
            <Card>
              <CardHeader>
                <CardTitle>Skills to Learn</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Missing skills for {stats.skillMatch.targetRole}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.skillMatch.missingSkills.slice(0, 6).map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-red-700">{skill}</span>
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        Missing
                      </Badge>
                    </div>
                  ))}
                  {stats.skillMatch.missingSkills.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                      <p>All required skills matched!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Additional Analytics */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Skill Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Trending Skills</CardTitle>
              <p className="text-sm text-muted-foreground">
                Market demand analysis
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chartData?.skillTrends.slice(0, 6).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        skill.trend === 'rising' ? 'bg-green-500' : 
                        skill.trend === 'stable' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium">{skill.skill}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={skill.demand} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">{skill.demand}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">
                Analysis score ranges
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData?.scoreDistribution || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ range, count }) => `${range}: ${count}`}
                  >
                    {chartData?.scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <p className="text-sm text-muted-foreground">
                {isDemoMode ? 'Demo mode status' : 'Database and audit status'}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Activity className="w-3 h-3 mr-1" />
                    {isDemoMode ? 'Demo' : 'Online'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Audit Logs</span>
                  <span className="text-sm font-medium">{stats?.auditStats?.totalLogs || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Models</span>
                  <span className="text-sm font-medium">{stats?.modelStats?.activeModels || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Recent Activity</span>
                  <span className="text-sm font-medium">{stats?.recentActivity || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced DBMS Features */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Features</CardTitle>
            <p className="text-sm text-muted-foreground">
              {isDemoMode 
                ? 'Demo showcasing analytics capabilities' 
                : 'This dashboard showcases complex database operations and analytics'
              }
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-medium mb-1">Data Analytics</h4>
                <p className="text-xs text-muted-foreground">Performance metrics and insights</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h4 className="font-medium mb-1">Trend Analysis</h4>
                <p className="text-xs text-muted-foreground">Market and skill trends</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h4 className="font-medium mb-1">ML Integration</h4>
                <p className="text-xs text-muted-foreground">Prediction analytics</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Award className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <h4 className="font-medium mb-1">Performance Tracking</h4>
                <p className="text-xs text-muted-foreground">Success rate monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
