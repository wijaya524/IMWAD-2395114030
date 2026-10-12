import trainedRulesData from './trained_rules.json';

export type DirectiveType =
  | 'NONE'
  | 'GENERAL_HINT'
  | 'SPECIFIC_VISUAL_CUE'
  | 'FALLBACK_STATIC';

export interface PredictionInput {
  moduleType: string;
  attemptIndex: number;
  idleTimeMs: number;
  consecutiveFailures: number;
  isDistractorClicked: boolean | number;
}

export interface PredictionOutput {
  directiveType: DirectiveType;
  confidenceScore: number;
  isFallback: boolean;
  executionTimeMs: number;
  explanationRules: string[];
  probabilities?: Record<string, number>;
}

export interface DecisionTreeNode {
  node_id: number;
  is_leaf: boolean;
  prediction?: string;
  confidence?: number;
  samples?: number;
  probabilities?: Record<string, number>;
  rule_path?: string;
  feature?: string;
  feature_index?: number;
  threshold?: number;
  left?: DecisionTreeNode;
  right?: DecisionTreeNode;
}

export interface ModelMetadata {
  model_type: string;
  criterion: string;
  max_depth: number;
  train_accuracy: number;
  test_accuracy: number;
  feature_names: string[];
  classes: string[];
  created_at: string;
}

export class DecisionTreeEngine {
  private rootNode: DecisionTreeNode;
  private metadata: ModelMetadata;

  constructor() {
    this.metadata = (trainedRulesData as any).metadata;
    this.rootNode = (trainedRulesData as any).root;
  }

  /**
   * Melakukan inferensi adaptif berdasarkan input interaksi siswa.
   * Latensi inferensi dijamin < 10 ms (rata-rata < 1 ms secara on-device/in-memory).
   */
  public predict(input: PredictionInput): PredictionOutput {
    const startTime = performance.now();
    const explanationRules: string[] = [];

    try {
      const distractorNumeric = typeof input.isDistractorClicked === 'boolean'
        ? (input.isDistractorClicked ? 1 : 0)
        : Number(input.isDistractorClicked) || 0;

      const featureMap: Record<string, number> = {
        attempt_index: Number(input.attemptIndex) || 1,
        idle_time_ms: Number(input.idleTimeMs) || 0,
        consecutive_failures: Number(input.consecutiveFailures) || 0,
        is_distractor_clicked: distractorNumeric,
      };

      let currentNode: DecisionTreeNode | undefined = this.rootNode;
      let depth = 0;

      while (currentNode && !currentNode.is_leaf) {
        depth++;
        const featureName = currentNode.feature;
        const threshold = currentNode.threshold;

        if (!featureName || threshold === undefined) {
          throw new Error(`Node ${currentNode.node_id} tidak valid: fitur atau threshold hilang.`);
        }

        const value = featureMap[featureName] ?? 0;

        if (value <= threshold) {
          explanationRules.push(
            `[Node ${currentNode.node_id} | Kedalaman ${depth}] ${featureName} (${value}) <= ${threshold} -> Cabang Kiri`
          );
          currentNode = currentNode.left;
        } else {
          explanationRules.push(
            `[Node ${currentNode.node_id} | Kedalaman ${depth}] ${featureName} (${value}) > ${threshold} -> Cabang Kanan`
          );
          currentNode = currentNode.right;
        }
      }

      if (!currentNode || !currentNode.prediction) {
        throw new Error('Daun pohon (leaf node) tidak menghasilkan prediksi yang valid.');
      }

      const endTime = performance.now();
      const executionTimeMs = Math.max(1, Math.round(endTime - startTime));

      const predictedDirective = currentNode.prediction as DirectiveType;
      const confidence = currentNode.confidence ?? 0.85;

      explanationRules.push(
        `[Hasil Evaluasi Daun]: Directive = ${predictedDirective} (Confidence: ${(confidence * 100).toFixed(1)}%)`
      );

      return {
        directiveType: predictedDirective,
        confidenceScore: confidence,
        isFallback: predictedDirective === 'FALLBACK_STATIC',
        executionTimeMs,
        explanationRules,
        probabilities: currentNode.probabilities,
      };
    } catch (error: any) {
      const endTime = performance.now();
      const executionTimeMs = Math.max(1, Math.round(endTime - startTime));

      explanationRules.push(`[Fallback Exception]: ${error.message || 'Error pada evaluasi pohon'}`);

      return {
        directiveType: 'FALLBACK_STATIC',
        confidenceScore: 0.5,
        isFallback: true,
        executionTimeMs,
        explanationRules,
      };
    }
  }

  public getMetadata(): ModelMetadata {
    return this.metadata;
  }
}

export const decisionTreeEngine = new DecisionTreeEngine();
