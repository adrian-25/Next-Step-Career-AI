import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Database, 
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MLTrainingService, TrainingResult, TrainingConfig } from '@/lib/mlTrainingService';

interface TrainingStatus {
  isTraining: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
}

export function MLTrainingDashboard() {
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>({
    isTraining: false,
    progress: 0,
    currentStep: '',
    error: null
  });
  const [latestResults, setLatestResults] = useState<TrainingResult | null>(null);
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig>({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 100,
    trainTestSplit: 0.8,
    modelType: 'neural_network'
  });

  useEffect(() => {
    loadLatestResults();
  }, []);

  const loadLatestResults = async () => {
    try {
      const results = await MLTrainingService.getLatestTrainingResults();
      setLatestResults(results);
    } catch (error) {
      console.error('Failed to load latest results:', error);
    }
  };

  const startTraining = async () => {
    setTrainingStatus({
      isTraining: true,
      progress: 0,
      currentStep: 'Initializing training pipeline...',
      error: null
    });

    try {
      // Simulate progress updates
      const progressSteps = [
        { progress: 10, step: 'Fetching training data...' },
        { progress: 25, step: 'Preprocessing data...' },
        { progress: 40, step: 'Running hyperparameter tuning...' },
        { progress: 70, step: 'Training neural network...' },
        { progress: 90, step: 'Evaluating model...' },
        { progress: 100, step: 'Saving results...' }
      ];

      for (const { progress, step } of progressSteps) {
        setTrainingStatus(prev => ({ ...prev, progress, currentStep: step }));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Run actual training
      const result = await MLTrainingService.runTrainingPipeline(trainingConfig);
      
      setTrainingStatus({
        isTraining: false,
        progress: 100,
        currentStep: 'Training completed successfully!',
        error: null
      });

      setLatestResults(result);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setTrainingStatus(prev => ({ ...prev, currentStep: '' }));
      }, 3000);

    } catch (error) {
      setTrainingStatus({
        isTraining: false,
        progress: 0,
        currentStep: '',
        error: error instanceof Error ? error.message : 'Training failed'
      });
    }
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const getMetricColor = (value: number): string => {
    if (value >= 0.8) return 'text-green-600';
    if (value >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">ML Training Dashboard</h2>
          <p className="text-muted-foreground">
            Train and improve your AI/ML model accuracy
          </p>
        </div>
        <Button
          onClick={startTraining}
          disabled={trainingStatus.isTraining}
          className="flex items-center space-x-2"
        >
          {trainingStatus.isTraining ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span>
            {trainingStatus.isTraining ? 'Training...' : 'Start Training'}
          </span>
        </Button>
      </div>

      {/* Training Status */}
      {trainingStatus.isTraining && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Training in Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{trainingStatus.progress}%</span>
              </div>
              <Progress value={trainingStatus.progress} className="w-full" />
            </div>
            <p className="text-sm text-muted-foreground">
              {trainingStatus.currentStep}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {trainingStatus.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {trainingStatus.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {trainingStatus.currentStep === 'Training completed successfully!' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Model training completed successfully! Check the results below.
          </AlertDescription>
        </Alert>
      )}

      {/* Latest Results */}
      {latestResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Model Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Model Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Accuracy</span>
                  <span className={`font-semibold ${getMetricColor(latestResults.metrics.accuracy)}`}>
                    {(latestResults.metrics.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Precision</span>
                  <span className={`font-semibold ${getMetricColor(latestResults.metrics.precision)}`}>
                    {(latestResults.metrics.precision * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Recall</span>
                  <span className={`font-semibold ${getMetricColor(latestResults.metrics.recall)}`}>
                    {(latestResults.metrics.recall * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">F1 Score</span>
                  <span className={`font-semibold ${getMetricColor(latestResults.metrics.f1Score)}`}>
                    {(latestResults.metrics.f1Score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Training Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Training Samples</span>
                  <span className="font-semibold">{latestResults.trainingDataSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Test Samples</span>
                  <span className="font-semibold">{latestResults.testDataSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Training Time</span>
                  <span className="font-semibold">{formatTime(latestResults.trainingTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Model Type</span>
                  <Badge variant="outline">{latestResults.config.modelType}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Learning Rate</span>
                  <span className="font-semibold">{latestResults.config.learningRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Batch Size</span>
                  <span className="font-semibold">{latestResults.config.batchSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Epochs</span>
                  <span className="font-semibold">{latestResults.config.epochs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Train/Test Split</span>
                  <span className="font-semibold">{latestResults.config.trainTestSplit}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Training History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Training History</span>
          </CardTitle>
          <CardDescription>
            Track model performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {latestResults ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Latest Training</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(latestResults.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {(latestResults.metrics.accuracy * 100).toFixed(1)}% Accuracy
                  </p>
                  <p className="text-sm text-muted-foreground">
                    F1: {(latestResults.metrics.f1Score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No training history available</p>
              <p className="text-sm text-muted-foreground">
                Start your first training session to see results here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {latestResults ? (latestResults.metrics.accuracy * 100).toFixed(1) : '0'}%
                </p>
                <p className="text-sm text-muted-foreground">Current Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {latestResults ? latestResults.trainingDataSize : '0'}
                </p>
                <p className="text-sm text-muted-foreground">Training Samples</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {latestResults ? formatTime(latestResults.trainingTime) : '0s'}
                </p>
                <p className="text-sm text-muted-foreground">Last Training Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {latestResults ? (latestResults.metrics.f1Score * 100).toFixed(1) : '0'}%
                </p>
                <p className="text-sm text-muted-foreground">F1 Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
