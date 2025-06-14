"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LineChart, ListChecks, UserRoundCog, TrendingUp } from "lucide-react"

// Simple sparkline chart component
const SparklineChart = ({ 
  data, 
  width = 600, 
  height = 200, 
  color = "#10b981" 
}: { 
  data?: number[], 
  width?: number, 
  height?: number, 
  color?: string 
}) => {
  // Generate random data if none provided
  const values = data || Array.from({ length: 30 }, (_, i) => 
    Math.floor(50 + Math.sin(i/2) * 20 + Math.random() * 15)
  );
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  // Calculate points for the path
  const points = values.map((value: number, index: number) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {/* Grid lines */}
      <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#334155" strokeWidth="1" strokeDasharray="4" />
      <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="#334155" strokeWidth="1" strokeDasharray="4" />
      <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#334155" strokeWidth="1" strokeDasharray="4" />
      
      {/* Sparkline */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Area under the line */}
      <polyline
        points={`0,${height} ${points} ${width},${height}`}
        fill="url(#gradient)"
        opacity="0.2"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Last point highlight */}
      <circle
        cx={width}
        cy={height - ((values[values.length - 1] - min) / range) * height}
        r="4"
        fill={color}
      />
    </svg>
  );
};

export default function MonitoringEvaluationDemo() {
  const { t } = useTranslation('demos')
  const [activeTab, setActiveTab] = useState("metrics")
  
  // Sample data for the chart
  const performanceData = [75, 70, 85, 82, 90, 92, 89, 91, 84, 88, 90, 85, 88, 92, 95, 98, 92, 94, 90, 95, 92, 98, 99, 95, 94, 90, 93, 94, 98, 99];
  const errorData = [8, 9, 7, 10, 8, 6, 7, 5, 6, 5, 4, 5, 7, 6, 4, 3, 5, 4, 3, 2, 3, 3, 2, 2, 3, 4, 3, 3, 2, 2];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="metrics" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 bg-slate-800/80 border border-slate-700 p-1 rounded-lg w-full">
          <TabsTrigger
            value="metrics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white transition-all data-[state=active]:shadow-lg"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('monitoringEvaluation.metrics')}
          </TabsTrigger>
          <TabsTrigger
            value="logging"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white transition-all data-[state=active]:shadow-lg"
          >
            <ListChecks className="h-4 w-4 mr-2" />
            {t('monitoringEvaluation.logging')}
          </TabsTrigger>
          <TabsTrigger
            value="evaluation"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white transition-all data-[state=active]:shadow-lg"
          >
            <UserRoundCog className="h-4 w-4 mr-2" />
            {t('monitoringEvaluation.evaluation')}
          </TabsTrigger>
        </TabsList>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:border-slate-600 transition-all">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <h3 className="text-slate-200 font-medium flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  {t('monitoringEvaluation.performanceMetrics')}
                </h3>
                <span className="text-xs text-slate-400">{t('monitoringEvaluation.updatedHourly')}</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center hover:border-emerald-500/30 transition-all">
                    <div className="text-2xl font-bold text-emerald-400">98%</div>
                    <div className="text-sm text-slate-400">{t('monitoringEvaluation.uptime')}</div>
                  </div>
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center hover:border-emerald-500/30 transition-all">
                    <div className="text-2xl font-bold text-emerald-400">250ms</div>
                    <div className="text-sm text-slate-400">{t('monitoringEvaluation.averageLatency')}</div>
                  </div>
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center hover:border-emerald-500/30 transition-all">
                    <div className="text-2xl font-bold text-emerald-400">4.5/5</div>
                    <div className="text-sm text-slate-400">{t('monitoringEvaluation.userSatisfaction')}</div>
                  </div>
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center hover:border-emerald-500/30 transition-all">
                    <div className="text-2xl font-bold text-emerald-400">2%</div>
                    <div className="text-sm text-slate-400">{t('monitoringEvaluation.errorRate')}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-400">
                  {t('monitoringEvaluation.metricsDescription')}
                </p>
              </div>
            </div>

            {/* Performance Trends Card */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:border-slate-600 transition-all">
              <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
                <h3 className="text-slate-200 font-medium flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-emerald-400" />
                  {t('monitoringEvaluation.performanceTrends')}
                </h3>
                <span className="text-xs text-slate-400">{t('monitoringEvaluation.last30Days')}</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="h-[200px] bg-slate-900/50 border border-slate-700 rounded-md flex items-center justify-center text-slate-400 overflow-hidden">
                  <SparklineChart data={performanceData} />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-400">
                    {t('monitoringEvaluation.trendsDescription')}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 px-2 py-1 bg-emerald-900/20 border border-emerald-500/30 rounded-full">+5.2% ↑</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Logging Tab */}
        <TabsContent value="logging" className="mt-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:border-slate-600 transition-all">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <h3 className="text-slate-200 font-medium flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-emerald-400" />
                {t('monitoringEvaluation.loggingConfiguration')}
              </h3>
              <span className="text-xs text-slate-400">{t('monitoringEvaluation.live')}</span>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-300">{t('monitoringEvaluation.logLevel')}</Label>
                <Select>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                    <SelectValue placeholder={t('monitoringEvaluation.selectLogLevel')} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="info">{t('monitoringEvaluation.info')}</SelectItem>
                    <SelectItem value="warning">{t('monitoringEvaluation.warning')}</SelectItem>
                    <SelectItem value="error">{t('monitoringEvaluation.error')}</SelectItem>
                    <SelectItem value="debug">{t('monitoringEvaluation.debug')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">{t('monitoringEvaluation.logDestination')}</Label>
                <Select>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20">
                    <SelectValue placeholder={t('monitoringEvaluation.selectLogDestination')} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="console">{t('monitoringEvaluation.console')}</SelectItem>
                    <SelectItem value="file">{t('monitoringEvaluation.file')}</SelectItem>
                    <SelectItem value="cloud">{t('monitoringEvaluation.cloud')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">{t('monitoringEvaluation.sampleLogEntry')}</Label>
                <Textarea
                  readOnly
                  className="min-h-[100px] bg-slate-900/50 border-slate-700 text-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                  value="[2023-10-27 10:00:00] INFO: Query processed successfully. Latency: 230ms"
                />
              </div>

              <div className="mt-6">
                <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-2 rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  {t('monitoringEvaluation.applyChanges')}
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Evaluation Tab */}
        <TabsContent value="evaluation" className="mt-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:border-slate-600 transition-all">
            <div className="px-5 py-4 bg-slate-700/50 flex items-center justify-between">
              <h3 className="text-slate-200 font-medium flex items-center gap-2">
                <UserRoundCog className="h-5 w-5 text-emerald-400" />
                {t('monitoringEvaluation.evaluationMetrics')}
              </h3>
              <span className="text-xs text-slate-400">{t('monitoringEvaluation.last1000Answers')}</span>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center hover:border-emerald-500/30 transition-all">
                  <div className="text-2xl font-bold text-emerald-400">95%</div>
                  <div className="text-sm text-slate-400">{t('monitoringEvaluation.relevance')}</div>
                </div>
                <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center hover:border-emerald-500/30 transition-all">
                  <div className="text-2xl font-bold text-emerald-400">90%</div>
                  <div className="text-sm text-slate-400">{t('monitoringEvaluation.accuracy')}</div>
                </div>
                <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center hover:border-emerald-500/30 transition-all">
                  <div className="text-2xl font-bold text-emerald-400">85%</div>
                  <div className="text-sm text-slate-400">{t('monitoringEvaluation.coherence')}</div>
                </div>
                <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center hover:border-emerald-500/30 transition-all">
                  <div className="text-2xl font-bold text-emerald-400">5%</div>
                  <div className="text-sm text-slate-400">{t('monitoringEvaluation.hallucinationRate')}</div>
                </div>
              </div>
              
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-slate-300 font-medium">{t('monitoringEvaluation.errorRateTrend')}</h4>
                  <span className="text-xs text-slate-300 px-2 py-1 bg-emerald-900/20 border border-emerald-500/30 rounded-full">-3.1% ↓</span>
                </div>
                <div className="h-[100px] overflow-hidden">
                  <SparklineChart data={errorData} height={100} />
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-5 mt-8">
                <h4 className="text-slate-300 mb-2 font-medium">{t('monitoringEvaluation.aboutTheseMetrics')}</h4>
                <p className="text-sm text-slate-400">
                  {t('monitoringEvaluation.metricsExplanation')}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
