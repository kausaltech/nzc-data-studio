export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: string; output: string; }
  JSON: { input: any; output: any; }
  JSONString: { input: string; output: string; }
  PositiveInt: { input: number; output: number; }
  RichText: { input: string; output: string; }
  UUID: { input: string; output: string; }
  _Any: { input: any; output: any; }
};

export type ActionConfigInput = {
  decisionLevel?: InputMaybe<DecisionLevel>;
  group?: InputMaybe<Scalars['String']['input']>;
  noEffectValue?: InputMaybe<Scalars['Float']['input']>;
  nodeClass: Scalars['String']['input'];
  parent?: InputMaybe<Scalars['String']['input']>;
};

export type ActionConfigType = {
  __typename?: 'ActionConfigType';
  decisionLevel?: Maybe<DecisionLevel>;
  group?: Maybe<Scalars['String']['output']>;
  noEffectValue?: Maybe<Scalars['Float']['output']>;
  nodeClass: Scalars['String']['output'];
  parent?: Maybe<Scalars['String']['output']>;
};

export type ActionGroupType = {
  __typename?: 'ActionGroupType';
  actions: Array<ActionNode>;
  color?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ActionImpact = {
  __typename?: 'ActionImpact';
  action: ActionNode;
  costDim?: Maybe<DimensionalMetricType>;
  /** @deprecated Use costDim instead. */
  costValues?: Maybe<Array<YearlyValue>>;
  effectDim: DimensionalMetricType;
  /** @deprecated Use effectDim instead. */
  impactValues?: Maybe<Array<Maybe<YearlyValue>>>;
  unitAdjustmentMultiplier?: Maybe<Scalars['Float']['output']>;
};

export type ActionImpactBlock = StreamFieldInterface & {
  __typename?: 'ActionImpactBlock';
  blockType: Scalars['String']['output'];
  blocks: Array<StreamFieldInterface>;
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  scenarioId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ActionImpactType = {
  __typename?: 'ActionImpactType';
  action: ActionNode;
  value: Scalars['Float']['output'];
  year: Scalars['Int']['output'];
};

export type ActionListPage = PageInterface & {
  __typename?: 'ActionListPage';
  aliasOf?: Maybe<Page>;
  ancestors: Array<PageInterface>;
  children: Array<PageInterface>;
  contentType: Scalars['String']['output'];
  defaultSortOrder: ActionSortOrder;
  depth?: Maybe<Scalars['Int']['output']>;
  descendants: Array<PageInterface>;
  draftTitle: Scalars['String']['output'];
  expireAt?: Maybe<Scalars['DateTime']['output']>;
  expired: Scalars['Boolean']['output'];
  firstPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  goLiveAt?: Maybe<Scalars['DateTime']['output']>;
  hasUnpublishedChanges: Scalars['Boolean']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  lastPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  latestRevisionCreatedAt?: Maybe<Scalars['DateTime']['output']>;
  leadParagraph?: Maybe<Scalars['String']['output']>;
  leadTitle?: Maybe<Scalars['String']['output']>;
  live: Scalars['Boolean']['output'];
  locked?: Maybe<Scalars['Boolean']['output']>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedBy?: Maybe<UserType>;
  nextSiblings: Array<PageInterface>;
  numchild: Scalars['Int']['output'];
  owner?: Maybe<UserType>;
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
  path: Scalars['String']['output'];
  previousSiblings: Array<PageInterface>;
  searchDescription?: Maybe<Scalars['String']['output']>;
  searchScore?: Maybe<Scalars['Float']['output']>;
  seoTitle: Scalars['String']['output'];
  showActionComparison?: Maybe<Scalars['Boolean']['output']>;
  showCumulativeImpact?: Maybe<Scalars['Boolean']['output']>;
  showInAdditionalLinks: Scalars['Boolean']['output'];
  showInFooter: Scalars['Boolean']['output'];
  showInMenus: Scalars['Boolean']['output'];
  showOnlyMunicipalActions?: Maybe<Scalars['Boolean']['output']>;
  siblings: Array<PageInterface>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  translationKey: Scalars['UUID']['output'];
  url?: Maybe<Scalars['String']['output']>;
  urlPath: Scalars['String']['output'];
};


export type ActionListPageDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  inMenu?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchOperator?: InputMaybe<SearchOperatorEnum>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type ActionNode = EditableEntity & NodeInterface & {
  __typename?: 'ActionNode';
  body?: Maybe<Array<StreamFieldInterface>>;
  /** Row-level change history for this node, newest first. */
  changeHistory: Array<InstanceModelLogEntryType>;
  color?: Maybe<Scalars['String']['output']>;
  decisionLevel?: Maybe<DecisionLevel>;
  description?: Maybe<Scalars['String']['output']>;
  dimensionalFlow?: Maybe<DimensionalFlowType>;
  downstreamNodes: Array<NodeInterface>;
  editor?: Maybe<NodeEditor>;
  explanation?: Maybe<Scalars['String']['output']>;
  goal?: Maybe<Scalars['RichText']['output']>;
  goals: Array<NodeGoal>;
  group?: Maybe<ActionGroupType>;
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  impactMetric?: Maybe<ForecastMetricType>;
  impactMetrics: Array<ForecastMetricType>;
  indicatorNode?: Maybe<Node>;
  inputNodes: Array<NodeInterface>;
  /** @deprecated Use __typeName instead */
  isAction: Scalars['Boolean']['output'];
  isEnabled: Scalars['Boolean']['output'];
  isVisible: Scalars['Boolean']['output'];
  kind?: Maybe<NodeKind>;
  metric?: Maybe<ForecastMetricType>;
  metricDim?: Maybe<DimensionalMetricType>;
  metrics?: Maybe<Array<ForecastMetricType>>;
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  outcome?: Maybe<DimensionalMetricType>;
  outputNodes: Array<NodeInterface>;
  parameters: Array<ParameterInterface>;
  parentAction?: Maybe<ActionNode>;
  quantity?: Maybe<Scalars['String']['output']>;
  quantityKind?: Maybe<QuantityKindType>;
  /** Stable UUID, populated for DB-backed nodes. Null for unsynced YAML nodes. */
  resolveUuid?: Maybe<Scalars['UUID']['output']>;
  shortDescription?: Maybe<Scalars['RichText']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  subactions: Array<ActionNode>;
  /** @deprecated Replaced by "goals". */
  targetYearGoal?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<UnitType>;
  upstreamNodes: Array<NodeInterface>;
  uuid: Scalars['UUID']['output'];
  visualizations?: Maybe<Array<VisualizationEntry>>;
};


export type ActionNodeChangeHistoryArgs = {
  before?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: Scalars['Int']['input'];
};


export type ActionNodeDownstreamNodesArgs = {
  maxDepth?: InputMaybe<Scalars['Int']['input']>;
  onlyOutcome?: Scalars['Boolean']['input'];
  untilNode?: InputMaybe<Scalars['ID']['input']>;
};


export type ActionNodeGoalsArgs = {
  activeGoal?: InputMaybe<Scalars['ID']['input']>;
};


export type ActionNodeImpactMetricArgs = {
  goalId?: InputMaybe<Scalars['ID']['input']>;
  targetNodeId?: InputMaybe<Scalars['ID']['input']>;
};


export type ActionNodeMetricArgs = {
  goalId?: InputMaybe<Scalars['ID']['input']>;
};


export type ActionNodeMetricDimArgs = {
  includeScenarioKinds?: InputMaybe<Array<ScenarioKind>>;
  withScenarios?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type ActionNodeUpstreamNodesArgs = {
  includeActions?: Scalars['Boolean']['input'];
  sameQuantity?: Scalars['Boolean']['input'];
  sameUnit?: Scalars['Boolean']['input'];
};

/** An enumeration. */
export enum ActionSortOrder {
  /** Cumulative impact */
  CumImpact = 'CUM_IMPACT',
  /** Impact */
  Impact = 'IMPACT',
  /** Standard */
  Standard = 'STANDARD'
}

export type ActivateScenarioResult = {
  __typename?: 'ActivateScenarioResult';
  activeScenario: ScenarioType;
  ok: Scalars['Boolean']['output'];
};

export type AddNodeInputPortPayload = InputPortType | OperationInfo;

export type AddNodeOutputPortPayload = OperationInfo | OutputPortType;

export type AdminButton = {
  __typename?: 'AdminButton';
  classname: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  target?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type AssignCategoryTransformationInput = {
  category: Scalars['String']['input'];
  dimension: Scalars['String']['input'];
};

export type AssignCategoryTransformationType = {
  __typename?: 'AssignCategoryTransformationType';
  category: Scalars['String']['output'];
  dimension: Scalars['String']['output'];
};

export type BlockQuoteBlock = StreamFieldInterface & {
  __typename?: 'BlockQuoteBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type BoolParameterType = ParameterInterface & {
  __typename?: 'BoolParameterType';
  defaultValue?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** Global ID for the parameter in the instance */
  id: Scalars['ID']['output'];
  isCustomizable: Scalars['Boolean']['output'];
  isCustomized: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  localId?: Maybe<Scalars['ID']['output']>;
  node?: Maybe<NodeInterface>;
  /** ID of parameter in the node's namespace */
  nodeRelativeId?: Maybe<Scalars['ID']['output']>;
  value?: Maybe<Scalars['Boolean']['output']>;
};

export type BooleanBlock = StreamFieldInterface & {
  __typename?: 'BooleanBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['Boolean']['output'];
};

export type CallToActionBlock = StreamFieldInterface & {
  __typename?: 'CallToActionBlock';
  blockType: Scalars['String']['output'];
  blocks: Array<StreamFieldInterface>;
  content: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  linkUrl: Scalars['String']['output'];
  rawValue: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CardListBlock = StreamFieldInterface & {
  __typename?: 'CardListBlock';
  blockType: Scalars['String']['output'];
  blocks: Array<StreamFieldInterface>;
  cards?: Maybe<Array<Maybe<CardListCardBlock>>>;
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type CardListCardBlock = {
  __typename?: 'CardListCardBlock';
  shortDescription?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type CategoryBreakdownBlock = StreamFieldInterface & {
  __typename?: 'CategoryBreakdownBlock';
  blockType: Scalars['String']['output'];
  blocks: Array<StreamFieldInterface>;
  dimensionId: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export enum ChangeTargetKind {
  DatasetPort = 'DATASET_PORT',
  DataPoint = 'DATA_POINT',
  Dimension = 'DIMENSION',
  DimensionCategory = 'DIMENSION_CATEGORY',
  Edge = 'EDGE',
  Instance = 'INSTANCE',
  Node = 'NODE',
  Unknown = 'UNKNOWN'
}

export type CharBlock = StreamFieldInterface & {
  __typename?: 'CharBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ChoiceBlock = StreamFieldInterface & {
  __typename?: 'ChoiceBlock';
  blockType: Scalars['String']['output'];
  choices: Array<ChoiceOption>;
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ChoiceOption = {
  __typename?: 'ChoiceOption';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** Collection type */
export type CollectionObjectType = {
  __typename?: 'CollectionObjectType';
  ancestors: Array<Maybe<CollectionObjectType>>;
  depth: Scalars['Int']['output'];
  descendants: Array<Maybe<CollectionObjectType>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  numchild: Scalars['Int']['output'];
  path: Scalars['String']['output'];
};

export type CoverageOutput = {
  __typename?: 'CoverageOutput';
  xml?: Maybe<Scalars['String']['output']>;
};

export type CreateDataPointInput = {
  date: Scalars['Date']['input'];
  dimensionCategoryIds?: InputMaybe<Array<Scalars['UUID']['input']>>;
  metricId: Scalars['UUID']['input'];
  value?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateDataPointPayload = DataPoint | OperationInfo;

export type CreateDimensionCategoriesPayload = InstanceDimension | OperationInfo;

export type CreateDimensionCategoryInput = {
  dimensionId: Scalars['UUID']['input'];
  id?: InputMaybe<Scalars['UUID']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  nextSibling?: InputMaybe<Scalars['ID']['input']>;
  previousSibling?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateEdgeInput = {
  fromNodeId: Scalars['String']['input'];
  fromPort?: Scalars['String']['input'];
  instanceId: Scalars['ID']['input'];
  toNodeId: Scalars['String']['input'];
  toPort?: InputMaybe<Scalars['String']['input']>;
  transformations?: InputMaybe<Array<EdgeTransformationInput>>;
};

export type CreateEdgePayload = NodeEdgeType | OperationInfo;

export type CreateFrameworkConfigMutation = {
  __typename?: 'CreateFrameworkConfigMutation';
  /** The created framework config instance */
  frameworkConfig?: Maybe<FrameworkConfig>;
  ok: Scalars['Boolean']['output'];
};

export type CreateInstanceInput = {
  frameworkId: Scalars['String']['input'];
  identifier: Scalars['String']['input'];
  name: Scalars['String']['input'];
  organizationName: Scalars['String']['input'];
};

export type CreateInstancePayload = CreateInstanceResult | OperationInfo;

export type CreateInstanceResult = {
  __typename?: 'CreateInstanceResult';
  instanceId: Scalars['ID']['output'];
  instanceName: Scalars['String']['output'];
};

export type CreateNzcFrameworkConfigMutation = {
  __typename?: 'CreateNZCFrameworkConfigMutation';
  /** The created framework config instance */
  frameworkConfig?: Maybe<FrameworkConfig>;
  ok: Scalars['Boolean']['output'];
};

export type CreateNodeInput = {
  allowNulls?: Scalars['Boolean']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  config: NodeConfigInput;
  description?: InputMaybe<Scalars['String']['input']>;
  i18n?: InputMaybe<Scalars['JSON']['input']>;
  identifier: Scalars['ID']['input'];
  inputDimensions?: InputMaybe<Array<Scalars['String']['input']>>;
  inputPorts?: InputMaybe<Array<InputPortInput>>;
  isOutcome?: Scalars['Boolean']['input'];
  isVisible?: Scalars['Boolean']['input'];
  kind?: NodeKind;
  minimumYear?: InputMaybe<Scalars['Int']['input']>;
  name?: Scalars['String']['input'];
  nodeGroup?: InputMaybe<Scalars['ID']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  outputDimensions?: InputMaybe<Array<Scalars['String']['input']>>;
  outputMetrics?: InputMaybe<Array<OutputMetricInput>>;
  outputPorts?: InputMaybe<Array<OutputPortInput>>;
  params?: InputMaybe<Scalars['JSON']['input']>;
  shortName?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateNodePayload = ActionNode | Node | OperationInfo;

export type CreateScenarioInput = {
  allActionsEnabled?: Scalars['Boolean']['input'];
  identifier: Scalars['String']['input'];
  instanceId: Scalars['ID']['input'];
  kind?: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateScenarioPayload = OperationInfo | ScenarioType;

export type CurrentProgressBarBlock = StreamFieldInterface & {
  __typename?: 'CurrentProgressBarBlock';
  blockType: Scalars['String']['output'];
  blocks: Array<StreamFieldInterface>;
  chartLabel: Scalars['String']['output'];
  color: Scalars['String']['output'];
  description: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type DashboardCardBlock = StreamFieldInterface & {
  __typename?: 'DashboardCardBlock';
  blockType: Scalars['String']['output'];
  blocks: Array<StreamFieldInterface>;
  callToAction: CallToActionBlock;
  description: Scalars['String']['output'];
  field: Scalars['String']['output'];
  /** @deprecated Use goalValues instead */
  goalValue?: Maybe<Scalars['Float']['output']>;
  goalValues?: Maybe<Array<Maybe<MetricYearlyGoalType>>>;
  id?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageObjectType>;
  lastHistoricalYearValue?: Maybe<Scalars['Float']['output']>;
  metricDimensionCategoryValues?: Maybe<Array<Maybe<MetricDimensionCategoryValue>>>;
  node: Node;
  rawValue: Scalars['String']['output'];
  referenceYearValue?: Maybe<Scalars['Float']['output']>;
  scenarioActionImpacts?: Maybe<Array<Maybe<ScenarioActionImpacts>>>;
  scenarioValues?: Maybe<Array<Maybe<ScenarioValue>>>;
  title: Scalars['String']['output'];
  unit: UnitType;
  visualizations?: Maybe<Array<Maybe<StreamFieldInterface>>>;
};

export type DashboardPage = PageInterface & {
  __typename?: 'DashboardPage';
  aliasOf?: Maybe<Page>;
  ancestors: Array<PageInterface>;
  backgroundColor?: Maybe<Scalars['String']['output']>;
  children: Array<PageInterface>;
  contentType: Scalars['String']['output'];
  dashboardCards?: Maybe<Array<Maybe<StreamFieldInterface>>>;
  depth?: Maybe<Scalars['Int']['output']>;
  descendants: Array<PageInterface>;
  draftTitle: Scalars['String']['output'];
  expireAt?: Maybe<Scalars['DateTime']['output']>;
  expired: Scalars['Boolean']['output'];
  firstPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  goLiveAt?: Maybe<Scalars['DateTime']['output']>;
  hasUnpublishedChanges: Scalars['Boolean']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  lastPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  latestRevisionCreatedAt?: Maybe<Scalars['DateTime']['output']>;
  leadParagraph?: Maybe<Scalars['String']['output']>;
  leadTitle?: Maybe<Scalars['String']['output']>;
  live: Scalars['Boolean']['output'];
  locked?: Maybe<Scalars['Boolean']['output']>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedBy?: Maybe<UserType>;
  nextSiblings: Array<PageInterface>;
  numchild: Scalars['Int']['output'];
  owner?: Maybe<UserType>;
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
  path: Scalars['String']['output'];
  previousSiblings: Array<PageInterface>;
  searchDescription?: Maybe<Scalars['String']['output']>;
  searchScore?: Maybe<Scalars['Float']['output']>;
  seoTitle: Scalars['String']['output'];
  showInAdditionalLinks: Scalars['Boolean']['output'];
  showInFooter: Scalars['Boolean']['output'];
  showInMenus: Scalars['Boolean']['output'];
  siblings: Array<PageInterface>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  translationKey: Scalars['UUID']['output'];
  url?: Maybe<Scalars['String']['output']>;
  urlPath: Scalars['String']['output'];
};


export type DashboardPageDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  inMenu?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchOperator?: InputMaybe<SearchOperatorEnum>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type DataPoint = {
  __typename?: 'DataPoint';
  date: Scalars['Date']['output'];
  dimensionCategories: Array<DatasetDimensionCategory>;
  id: Scalars['ID']['output'];
  metric: DatasetMetric;
  value?: Maybe<Scalars['Float']['output']>;
};

export type Dataset = {
  __typename?: 'Dataset';
  data: Array<DimensionalMetricType>;
  dataPoints: Array<DataPoint>;
  dimensions: Array<DatasetDimension>;
  /** External source reference for externally backed datasets. */
  externalRef?: Maybe<DatasetExternalRefType>;
  id: Scalars['ID']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  /** Whether the dataset object is only a placeholder without imported datapoints. */
  isExternalPlaceholder: Scalars['Boolean']['output'];
  metrics: Array<DatasetMetric>;
  name: Scalars['String']['output'];
  portBindings: Array<DatasetPortType>;
};

export type DatasetDimension = {
  __typename?: 'DatasetDimension';
  categories: Array<DatasetDimensionCategory>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type DatasetDimensionCategory = {
  __typename?: 'DatasetDimensionCategory';
  identifier?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  uuid: Scalars['UUID']['output'];
};

export type DatasetEditorMutation = {
  __typename?: 'DatasetEditorMutation';
  /** Create a data point */
  createDataPoint: CreateDataPointPayload;
  /** Delete a data point */
  deleteDataPoint?: Maybe<OperationInfo>;
  /** Update a data point */
  updateDataPoint: UpdateDataPointPayload;
};


export type DatasetEditorMutationCreateDataPointArgs = {
  input: CreateDataPointInput;
};


export type DatasetEditorMutationDeleteDataPointArgs = {
  dataPointId: Scalars['ID']['input'];
};


export type DatasetEditorMutationUpdateDataPointArgs = {
  dataPointId: Scalars['ID']['input'];
  input: UpdateDataPointInput;
};

export type DatasetExternalRefType = {
  __typename?: 'DatasetExternalRefType';
  /** Repository commit used for this dataset snapshot. */
  commit?: Maybe<Scalars['String']['output']>;
  /** Path-like identifier of the dataset inside the external repository. */
  datasetId: Scalars['String']['output'];
  /** URL of the external dataset repository. */
  repoUrl: Scalars['String']['output'];
};

export type DatasetMetric = {
  __typename?: 'DatasetMetric';
  id: Scalars['ID']['output'];
  /** Human-readable label. */
  label: Scalars['String']['output'];
  /** Column name used in DataFrames. */
  name?: Maybe<Scalars['String']['output']>;
  nextSibling?: Maybe<Scalars['ID']['output']>;
  previousSibling?: Maybe<Scalars['ID']['output']>;
  unit: Scalars['String']['output'];
};

export type DatasetMetricRefType = {
  __typename?: 'DatasetMetricRefType';
  /** Globally unique identifier of the dataset metric object. */
  id: Scalars['ID']['output'];
  /** Human-readable label of the metric. */
  label: Scalars['String']['output'];
  /** Stable identifier of the metric within its dataset schema. */
  name?: Maybe<Scalars['String']['output']>;
};

export type DatasetPortType = EditableEntity & {
  __typename?: 'DatasetPortType';
  /** Row-level change history for this dataset-port binding, newest first. */
  changeHistory: Array<InstanceModelLogEntryType>;
  data: Array<DimensionalMetricType>;
  dataset?: Maybe<Dataset>;
  /** Stable identifier of the external dataset, typically the dataset repo path without extension. */
  externalDatasetId?: Maybe<Scalars['String']['output']>;
  /** Stable identifier of the external metric within the dataset. */
  externalMetricId?: Maybe<Scalars['String']['output']>;
  /** Globally unique identifier of the dataset-port binding. */
  id: Scalars['ID']['output'];
  /** Dataset metric object bound to this port. */
  metric?: Maybe<DatasetMetricRefType>;
  /** Reference to the node and its bound input port. */
  nodeRef: NodePortRef;
  uuid: Scalars['UUID']['output'];
};


export type DatasetPortTypeChangeHistoryArgs = {
  before?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: Scalars['Int']['input'];
};

export type DatasetRepoType = {
  __typename?: 'DatasetRepoType';
  commit?: Maybe<Scalars['String']['output']>;
  dvcRemote?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type DateBlock = StreamFieldInterface & {
  __typename?: 'DateBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};


export type DateBlockValueArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};

export type DateTimeBlock = StreamFieldInterface & {
  __typename?: 'DateTimeBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};


export type DateTimeBlockValueArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};

export type DecimalBlock = StreamFieldInterface & {
  __typename?: 'DecimalBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

/** Which governance level is applicable for an action */
export enum DecisionLevel {
  Eu = 'EU',
  Municipality = 'MUNICIPALITY',
  Nation = 'NATION'
}

export type DeleteFrameworkConfigMutation = {
  __typename?: 'DeleteFrameworkConfigMutation';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Desired (benificial) direction for the values of the output of a node */
export enum DesiredOutcome {
  Decreasing = 'decreasing',
  Increasing = 'increasing'
}

export enum DimensionKind {
  Common = 'COMMON',
  Node = 'NODE',
  Scenario = 'SCENARIO'
}

export type DimensionalFlowType = {
  __typename?: 'DimensionalFlowType';
  id: Scalars['String']['output'];
  links: Array<FlowLinksType>;
  nodes: Array<FlowNodeType>;
  sources: Array<Scalars['String']['output']>;
  unit: UnitType;
};

export type DimensionalMetricGoalEntry = {
  __typename?: 'DimensionalMetricGoalEntry';
  categories: Array<Scalars['String']['output']>;
  groups: Array<Scalars['String']['output']>;
  values: Array<MetricYearlyGoalType>;
};

export type DimensionalMetricType = {
  __typename?: 'DimensionalMetricType';
  dimensions: Array<MetricDimensionType>;
  forecastFrom?: Maybe<Scalars['Int']['output']>;
  goals: Array<DimensionalMetricGoalEntry>;
  id: Scalars['ID']['output'];
  measureDatapointYears: Array<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  normalizedBy?: Maybe<NormalizerNodeType>;
  stackable: Scalars['Boolean']['output'];
  unit: UnitType;
  values: Array<Scalars['Float']['output']>;
  years: Array<Scalars['Int']['output']>;
};

export type DocumentChooserBlock = StreamFieldInterface & {
  __typename?: 'DocumentChooserBlock';
  blockType: Scalars['String']['output'];
  document?: Maybe<DocumentObjectType>;
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
};

/**
 * Base document type used if one isn't generated for the current model.
 * All other node types extend this.
 */
export type DocumentObjectType = {
  __typename?: 'DocumentObjectType';
  collection: CollectionObjectType;
  createdAt: Scalars['DateTime']['output'];
  file: Scalars['String']['output'];
  fileHash: Scalars['String']['output'];
  fileSize?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  tags: Array<TagObjectType>;
  title: Scalars['String']['output'];
  uploadedByUser?: Maybe<UserType>;
  url: Scalars['String']['output'];
};

export type EdgeTransformationInput = {
  assignCategory?: InputMaybe<AssignCategoryTransformationInput>;
  flatten?: InputMaybe<FlattenTransformationInput>;
  selectCategories?: InputMaybe<SelectCategoriesTransformationInput>;
};

export type EdgeTransformationUnion = AssignCategoryTransformationType | FlattenTransformationType | SelectCategoriesTransformationType;

export type EditableEntity = {
  /** Row-level change history for this entity, newest first. */
  changeHistory: Array<InstanceModelLogEntryType>;
  uuid: Scalars['UUID']['output'];
};


export type EditableEntityChangeHistoryArgs = {
  before?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: Scalars['Int']['input'];
};

export type EmailBlock = StreamFieldInterface & {
  __typename?: 'EmailBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type EmbedBlock = StreamFieldInterface & {
  __typename?: 'EmbedBlock';
  blockType: Scalars['String']['output'];
  embed?: Maybe<Scalars['String']['output']>;
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawEmbed?: Maybe<Scalars['JSONString']['output']>;
  rawValue: Scalars['String']['output'];
  url: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type FlattenTransformationInput = {
  dimension: Scalars['String']['input'];
};

export type FlattenTransformationType = {
  __typename?: 'FlattenTransformationType';
  dimension: Scalars['String']['output'];
};

export type FloatBlock = StreamFieldInterface & {
  __typename?: 'FloatBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type FlowLinksType = {
  __typename?: 'FlowLinksType';
  absoluteSourceValues: Array<Scalars['Float']['output']>;
  isForecast: Scalars['Boolean']['output'];
  sources: Array<Scalars['String']['output']>;
  targets: Array<Scalars['String']['output']>;
  values: Array<Maybe<Scalars['Float']['output']>>;
  year: Scalars['Int']['output'];
};

export type FlowNodeType = {
  __typename?: 'FlowNodeType';
  color?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  label: Scalars['String']['output'];
};

export type ForecastMetricType = {
  __typename?: 'ForecastMetricType';
  baselineForecastValues?: Maybe<Array<YearlyValue>>;
  cumulativeForecastValue?: Maybe<Scalars['Float']['output']>;
  forecastValues: Array<YearlyValue>;
  historicalValues: Array<YearlyValue>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<UnitType>;
  yearlyCumulativeUnit?: Maybe<UnitType>;
};


export type ForecastMetricTypeHistoricalValuesArgs = {
  latest?: InputMaybe<Scalars['Int']['input']>;
};

export type FormulaConfigInput = {
  formula: Scalars['String']['input'];
};

export type FormulaConfigType = {
  __typename?: 'FormulaConfigType';
  formula: Scalars['String']['output'];
};

/**
 * Represents a framework for Paths models.
 *
 * A framework is a combination of a common computation model,
 * a set of measures (with their default, fallback values),
 * the data that is collected per model instance, and classifications
 * for the default values.
 *
 * This model defines the common metadata for a model, including its name
 * and description. It serves as the top-level container for related components
 * such as dimensions, sections, and measure templates.
 *
 * Attributes
 * ----------
 *     name (CharField): The name of the framework, limited to 200 characters.
 *     description (TextField): An optional description of the framework.
 */
export type Framework = {
  __typename?: 'Framework';
  /** Whether authenticated users can create new model instances under this framework. */
  allowInstanceCreation: Scalars['Boolean']['output'];
  /** Whether new users can self-register under this framework. */
  allowUserRegistration: Scalars['Boolean']['output'];
  config?: Maybe<FrameworkConfig>;
  configs: Array<FrameworkConfig>;
  defaults: FrameworkDefaultsType;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  measureTemplate?: Maybe<MeasureTemplate>;
  name: Scalars['String']['output'];
  section?: Maybe<Section>;
  sections: Array<Section>;
  userPermissions?: Maybe<UserPermissions>;
  userRoles?: Maybe<Array<Scalars['String']['output']>>;
};


/**
 * Represents a framework for Paths models.
 *
 * A framework is a combination of a common computation model,
 * a set of measures (with their default, fallback values),
 * the data that is collected per model instance, and classifications
 * for the default values.
 *
 * This model defines the common metadata for a model, including its name
 * and description. It serves as the top-level container for related components
 * such as dimensions, sections, and measure templates.
 *
 * Attributes
 * ----------
 *     name (CharField): The name of the framework, limited to 200 characters.
 *     description (TextField): An optional description of the framework.
 */
export type FrameworkConfigArgs = {
  id: Scalars['ID']['input'];
};


/**
 * Represents a framework for Paths models.
 *
 * A framework is a combination of a common computation model,
 * a set of measures (with their default, fallback values),
 * the data that is collected per model instance, and classifications
 * for the default values.
 *
 * This model defines the common metadata for a model, including its name
 * and description. It serves as the top-level container for related components
 * such as dimensions, sections, and measure templates.
 *
 * Attributes
 * ----------
 *     name (CharField): The name of the framework, limited to 200 characters.
 *     description (TextField): An optional description of the framework.
 */
export type FrameworkMeasureTemplateArgs = {
  id: Scalars['ID']['input'];
};


/**
 * Represents a framework for Paths models.
 *
 * A framework is a combination of a common computation model,
 * a set of measures (with their default, fallback values),
 * the data that is collected per model instance, and classifications
 * for the default values.
 *
 * This model defines the common metadata for a model, including its name
 * and description. It serves as the top-level container for related components
 * such as dimensions, sections, and measure templates.
 *
 * Attributes
 * ----------
 *     name (CharField): The name of the framework, limited to 200 characters.
 *     description (TextField): An optional description of the framework.
 */
export type FrameworkSectionArgs = {
  identifier: Scalars['ID']['input'];
};

/**
 * Represents a configuration of a Framework for a specific instance.
 *
 * This model links a Framework to an InstanceConfig, allowing for customization
 * of framework settings for each organization or instance. It includes fields
 * for specifying the organization name, baseline year, and associated categories.
 */
export type FrameworkConfig = {
  __typename?: 'FrameworkConfig';
  baselineYear: Scalars['Int']['output'];
  extra: Scalars['JSONString']['output'];
  framework: Framework;
  id: Scalars['ID']['output'];
  instance?: Maybe<InstanceType>;
  instanceIdentifier: Scalars['String']['output'];
  isLocked: Scalars['Boolean']['output'];
  measures: Array<Measure>;
  organizationIdentifier?: Maybe<Scalars['String']['output']>;
  organizationName?: Maybe<Scalars['String']['output']>;
  organizationSlug?: Maybe<Scalars['String']['output']>;
  /** URL for downloading a results file */
  resultsDownloadUrl?: Maybe<Scalars['String']['output']>;
  targetYear?: Maybe<Scalars['Int']['output']>;
  userPermissions?: Maybe<UserPermissions>;
  userRoles?: Maybe<Array<Scalars['String']['output']>>;
  uuid: Scalars['UUID']['output'];
  /** Public URL for instance dashboard */
  viewUrl?: Maybe<Scalars['String']['output']>;
};

export type FrameworkConfigInput = {
  baselineYear: Scalars['Int']['input'];
  frameworkId: Scalars['ID']['input'];
  /** Identifier for the model instance. Needs to be unique. */
  instanceIdentifier: Scalars['ID']['input'];
  /** Name for the framework configuration instance. Typically the name of the organization. */
  name: Scalars['String']['input'];
  /** Name of the organization. If not set, it will be determined through the user's credentials, if possible. */
  organizationName?: InputMaybe<Scalars['String']['input']>;
  /** Target year for model. */
  targetYear?: InputMaybe<Scalars['Int']['input']>;
  /** UUID for the new framework config. If not set, will be generated automatically. */
  uuid?: InputMaybe<Scalars['UUID']['input']>;
};

export type FrameworkDefaultsType = {
  __typename?: 'FrameworkDefaultsType';
  baselineYear: MinMaxDefaultIntType;
  targetYear: MinMaxDefaultIntType;
};

export type FrameworkLandingBlock = StreamFieldInterface & {
  __typename?: 'FrameworkLandingBlock';
  blockType: Scalars['String']['output'];
  blocks: Array<StreamFieldInterface>;
  body?: Maybe<Scalars['String']['output']>;
  ctaLabel?: Maybe<Scalars['String']['output']>;
  ctaUrl?: Maybe<Scalars['String']['output']>;
  field: Scalars['String']['output'];
  framework?: Maybe<Framework>;
  heading: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
};

/** An enumeration. */
export enum FrameworksMeasureTemplateDefaultValueScalingChoices {
  /** Population */
  Population = 'POPULATION'
}

/** An enumeration. */
export enum FrameworksMeasureTemplatePriorityChoices {
  /** High */
  High = 'HIGH',
  /** Low */
  Low = 'LOW',
  /** Medium */
  Medium = 'MEDIUM'
}

export type GoalProgressBarBlock = StreamFieldInterface & {
  __typename?: 'GoalProgressBarBlock';
  blockType: Scalars['String']['output'];
  blocks: Array<StreamFieldInterface>;
  chartLabel: Scalars['String']['output'];
  color: Scalars['String']['output'];
  description: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type GraphLayout = {
  __typename?: 'GraphLayout';
  actionIds: Array<Scalars['ID']['output']>;
  coreNodeIds: Array<Scalars['ID']['output']>;
  ghostableContextSourceIds: Array<Scalars['ID']['output']>;
  hubIds: Array<Scalars['ID']['output']>;
  mainGraphNodeIds: Array<Scalars['ID']['output']>;
  outcomeIds: Array<Scalars['ID']['output']>;
  thresholds: GraphLayoutThresholds;
};

export type GraphLayoutThresholds = {
  __typename?: 'GraphLayoutThresholds';
  ghostableAvgOutgoingSpan: Scalars['Float']['output'];
  ghostableOutDegree: Scalars['Int']['output'];
  ghostableTotalDegree: Scalars['Int']['output'];
  hubDegree: Scalars['Int']['output'];
};

export type ImageBlock = StreamFieldInterface & {
  __typename?: 'ImageBlock';
  altText?: Maybe<Scalars['String']['output']>;
  blockType: Scalars['String']['output'];
  decorative?: Maybe<Scalars['Boolean']['output']>;
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageObjectType>;
  rawValue: Scalars['String']['output'];
};

export type ImageChooserBlock = StreamFieldInterface & {
  __typename?: 'ImageChooserBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageObjectType>;
  rawValue: Scalars['String']['output'];
};

export type ImageObjectType = {
  __typename?: 'ImageObjectType';
  aspectRatio: Scalars['Float']['output'];
  collection: CollectionObjectType;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  file: Scalars['String']['output'];
  fileHash: Scalars['String']['output'];
  fileSize?: Maybe<Scalars['Int']['output']>;
  focalPointHeight?: Maybe<Scalars['Int']['output']>;
  focalPointWidth?: Maybe<Scalars['Int']['output']>;
  focalPointX?: Maybe<Scalars['Int']['output']>;
  focalPointY?: Maybe<Scalars['Int']['output']>;
  height: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isSvg: Scalars['Boolean']['output'];
  rendition?: Maybe<ImageRenditionObjectType>;
  renditions: Array<ImageRenditionObjectType>;
  sizes: Scalars['String']['output'];
  /** @deprecated Use the `url` attribute */
  src: Scalars['String']['output'];
  srcSet?: Maybe<Scalars['String']['output']>;
  tags: Array<TagObjectType>;
  title: Scalars['String']['output'];
  uploadedByUser?: Maybe<UserType>;
  url: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};


export type ImageObjectTypeRenditionArgs = {
  bgcolor?: InputMaybe<Scalars['String']['input']>;
  fill?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  jpegquality?: InputMaybe<Scalars['Int']['input']>;
  max?: InputMaybe<Scalars['String']['input']>;
  min?: InputMaybe<Scalars['String']['input']>;
  preserveSvg?: InputMaybe<Scalars['Boolean']['input']>;
  webpquality?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};


export type ImageObjectTypeSrcSetArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
  preserveSvg?: InputMaybe<Scalars['Boolean']['input']>;
  sizes?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type ImageRenditionObjectType = {
  __typename?: 'ImageRenditionObjectType';
  alt: Scalars['String']['output'];
  backgroundPositionStyle: Scalars['String']['output'];
  file: Scalars['String']['output'];
  filterSpec: Scalars['String']['output'];
  focalPoint?: Maybe<Scalars['String']['output']>;
  focalPointKey: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  image: ImageObjectType;
  url: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export type ImpactOverviewType = {
  __typename?: 'ImpactOverviewType';
  actions: Array<ActionImpact>;
  costCategoryLabel?: Maybe<Scalars['String']['output']>;
  costCutpoint?: Maybe<Scalars['Float']['output']>;
  costLabel?: Maybe<Scalars['String']['output']>;
  costNode?: Maybe<Node>;
  costUnit?: Maybe<UnitType>;
  description?: Maybe<Scalars['String']['output']>;
  effectCategoryLabel?: Maybe<Scalars['String']['output']>;
  effectLabel?: Maybe<Scalars['String']['output']>;
  effectNode: Node;
  effectUnit?: Maybe<UnitType>;
  graphType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  indicatorCutpoint?: Maybe<Scalars['Float']['output']>;
  indicatorLabel?: Maybe<Scalars['String']['output']>;
  indicatorUnit: UnitType;
  label: Scalars['String']['output'];
  outcomeDimension?: Maybe<Scalars['String']['output']>;
  plotLimitForIndicator?: Maybe<Scalars['Float']['output']>;
  stakeholderDimension?: Maybe<Scalars['String']['output']>;
  wedge?: Maybe<Array<WedgeEntryType>>;
};

export type InputPortBindingUnion = DatasetPortType | NodeEdgeType;

export type InputPortInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  multi?: Scalars['Boolean']['input'];
  quantity?: InputMaybe<Scalars['String']['input']>;
  requiredDimensions?: InputMaybe<Array<Scalars['String']['input']>>;
  supportedDimensions?: InputMaybe<Array<Scalars['String']['input']>>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type InputPortType = {
  __typename?: 'InputPortType';
  bindings: Array<InputPortBindingUnion>;
  id: Scalars['UUID']['output'];
  label?: Maybe<Scalars['String']['output']>;
  multi: Scalars['Boolean']['output'];
  quantity?: Maybe<Scalars['String']['output']>;
  requiredDimensions: Array<Scalars['String']['output']>;
  supportedDimensions: Array<Scalars['String']['output']>;
  unit?: Maybe<UnitType>;
};

export type InstanceBasicConfiguration = {
  __typename?: 'InstanceBasicConfiguration';
  defaultLanguage: Scalars['String']['output'];
  hostname: InstanceHostname;
  identifier: Scalars['String']['output'];
  isProtected: Scalars['Boolean']['output'];
  requiresAuthentication: Scalars['Boolean']['output'];
  supportedLanguages: Array<Scalars['String']['output']>;
  themeIdentifier: Scalars['String']['output'];
};

export type InstanceChange = {
  __typename?: 'InstanceChange';
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  modifiedAt: Scalars['DateTime']['output'];
};

export type InstanceChangeOperationType = {
  __typename?: 'InstanceChangeOperationType';
  /** Top-level action that triggered the operation, e.g. 'node.delete'. */
  action: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Row-level entries bundled under this operation, in insertion order. */
  entries: Array<InstanceModelLogEntryType>;
  /** Transport that initiated the operation (graphql / rest / admin / cli / migration). */
  source: Scalars['String']['output'];
  /** UUID of the operation that undid this one, if any. */
  supersededByUuid?: Maybe<Scalars['UUID']['output']>;
  /** Email of the user who initiated the operation, or null for system. */
  userEmail?: Maybe<Scalars['String']['output']>;
  uuid: Scalars['UUID']['output'];
};

export type InstanceContext = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  preview?: InputMaybe<PreviewMode>;
  version?: InputMaybe<Scalars['UUID']['input']>;
};

export type InstanceDimension = {
  __typename?: 'InstanceDimension';
  categories: Array<InstanceDimensionCategory>;
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type InstanceDimensionCategory = {
  __typename?: 'InstanceDimensionCategory';
  id: Scalars['ID']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  nextSibling?: Maybe<Scalars['ID']['output']>;
  order: Scalars['Int']['output'];
  previousSibling?: Maybe<Scalars['ID']['output']>;
};

export type InstanceEditor = {
  __typename?: 'InstanceEditor';
  /** Audit trail of user-facing edits to this instance, newest first. Each operation bundles one or more row-level entries. */
  changeHistory: Array<InstanceChangeOperationType>;
  configSource: Scalars['String']['output'];
  datasetPorts: Array<DatasetPortType>;
  datasets: Array<Dataset>;
  dimensions: Array<InstanceDimension>;
  /** Optimistic-locking token for draft edits. Editing mutations must pass this value via `@instance(version: ...)` or `@context(input: { version: ... })`; mismatched tokens are rejected with a stale-version error. `null` if no edits have ever been recorded for this instance. */
  draftHeadToken?: Maybe<Scalars['UUID']['output']>;
  edges: Array<NodeEdgeType>;
  firstPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  graphLayout: GraphLayout;
  hasUnpublishedChanges: Scalars['Boolean']['output'];
  isLocked: Scalars['Boolean']['output'];
  lastPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  live: Scalars['Boolean']['output'];
  spec?: Maybe<InstanceSpec>;
};


export type InstanceEditorChangeHistoryArgs = {
  before?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: Scalars['Int']['input'];
};

export type InstanceEditorMutation = {
  __typename?: 'InstanceEditorMutation';
  /** Append a new input port to a node */
  addNodeInputPort: AddNodeInputPortPayload;
  /** Append a new output port to a node */
  addNodeOutputPort: AddNodeOutputPortPayload;
  /** Add categories to a dimension */
  createDimensionCategories: CreateDimensionCategoriesPayload;
  /** Create a new edge between nodes */
  createEdge: CreateEdgePayload;
  /** Create a new node in the model */
  createNode: CreateNodePayload;
  /** Create a new scenario */
  createScenario: CreateScenarioPayload;
  /** Edit a DB-backed dataset that belongs to this instance */
  datasetEditor: DatasetEditorMutation;
  /** Delete a dimension category */
  deleteDimensionCategory?: Maybe<OperationInfo>;
  /** Delete an edge */
  deleteEdge?: Maybe<OperationInfo>;
  /** Delete a node and its edges */
  deleteNode?: Maybe<OperationInfo>;
  /** Delete a scenario */
  deleteScenario?: Maybe<OperationInfo>;
  /** Publish the current model state as a new revision */
  publishModelInstance: PublishModelInstancePayload;
  /** Revert draft to the last published revision */
  revertModelInstance: InstanceType;
  /** Update a dimension (e.g. rename) */
  updateDimension: UpdateDimensionPayload;
  /** Update dimension categories */
  updateDimensionCategories: UpdateDimensionCategoriesPayload;
  /** Update an existing node */
  updateNode: UpdateNodePayload;
  /** Update a scenario */
  updateScenario: UpdateScenarioPayload;
};


export type InstanceEditorMutationAddNodeInputPortArgs = {
  input: InputPortInput;
  nodeId: Scalars['ID']['input'];
};


export type InstanceEditorMutationAddNodeOutputPortArgs = {
  input: OutputPortInput;
  nodeId: Scalars['ID']['input'];
};


export type InstanceEditorMutationCreateDimensionCategoriesArgs = {
  input: Array<CreateDimensionCategoryInput>;
};


export type InstanceEditorMutationCreateEdgeArgs = {
  input: CreateEdgeInput;
};


export type InstanceEditorMutationCreateNodeArgs = {
  input: CreateNodeInput;
};


export type InstanceEditorMutationCreateScenarioArgs = {
  input: CreateScenarioInput;
};


export type InstanceEditorMutationDatasetEditorArgs = {
  datasetId: Scalars['ID']['input'];
};


export type InstanceEditorMutationDeleteDimensionCategoryArgs = {
  categoryId: Scalars['UUID']['input'];
};


export type InstanceEditorMutationDeleteEdgeArgs = {
  edgeId: Scalars['ID']['input'];
};


export type InstanceEditorMutationDeleteNodeArgs = {
  nodeId: Scalars['ID']['input'];
};


export type InstanceEditorMutationDeleteScenarioArgs = {
  scenarioId: Scalars['ID']['input'];
};


export type InstanceEditorMutationPublishModelInstanceArgs = {
  instanceId: Scalars['ID']['input'];
};


export type InstanceEditorMutationRevertModelInstanceArgs = {
  instanceId: Scalars['ID']['input'];
};


export type InstanceEditorMutationUpdateDimensionArgs = {
  input: UpdateDimensionInput;
};


export type InstanceEditorMutationUpdateDimensionCategoriesArgs = {
  input: Array<UpdateDimensionCategoryInput>;
};


export type InstanceEditorMutationUpdateNodeArgs = {
  input: UpdateNodeInput;
  nodeId: Scalars['ID']['input'];
};


export type InstanceEditorMutationUpdateScenarioArgs = {
  input: UpdateScenarioInput;
};

/**
 * Features available for the instance.
 *
 * Used mostly by the UI to customize the display of the results.
 */
export type InstanceFeaturesType = {
  __typename?: 'InstanceFeaturesType';
  /** Whether to display the baseline data in graphs and visualizations. */
  baselineVisibleInGraphs: Scalars['Boolean']['output'];
  /** Whether to hide detailed node information in the UI. */
  hideNodeDetails: Scalars['Boolean']['output'];
  /** Maximum number of decimal places to display after the decimal point. None means no limit. */
  maximumFractionDigits?: Maybe<Scalars['Int']['output']>;
  /** Whether authentication is required to access this instance. */
  requiresAuthentication: Scalars['Boolean']['output'];
  /** Whether to display accumulated effects over time in the UI. */
  showAccumulatedEffects: Scalars['Boolean']['output'];
  /** Whether to show category warnings in the node explanation. */
  showCategoryWarnings: Scalars['Boolean']['output'];
  /** Whether to show node explanation in the slot for description (under the graph). */
  showExplanations: Scalars['Boolean']['output'];
  /** Whether to show a prompt to refresh data when it might be outdated. */
  showRefreshPrompt: Scalars['Boolean']['output'];
  /** Number of significant digits to display in numerical results. None means no limit. */
  showSignificantDigits?: Maybe<Scalars['Int']['output']>;
  /** Whether to use datasets from the database instead of the .parquet files. */
  useDatasetsFromDb: Scalars['Boolean']['output'];
};

export type InstanceGoalDimension = {
  __typename?: 'InstanceGoalDimension';
  categories: Array<Scalars['String']['output']>;
  /** @deprecated replaced with categories */
  category: Scalars['String']['output'];
  dimension: Scalars['String']['output'];
  groups: Array<Scalars['String']['output']>;
};

export type InstanceGoalEntry = {
  __typename?: 'InstanceGoalEntry';
  default: Scalars['Boolean']['output'];
  dimensions: Array<InstanceGoalDimension>;
  disableReason?: Maybe<Scalars['String']['output']>;
  disabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  label?: Maybe<Scalars['String']['output']>;
  outcomeNode: Node;
  unit: UnitType;
  values: Array<InstanceYearlyGoalType>;
};

export type InstanceHostname = {
  __typename?: 'InstanceHostname';
  basePath: Scalars['String']['output'];
  hostname: Scalars['String']['output'];
};

export type InstanceModelLogEntryType = {
  __typename?: 'InstanceModelLogEntryType';
  /** Dotted action id, e.g. 'node.update'. */
  action: Scalars['String']['output'];
  /** State after the change. Null for delete operations. */
  after?: Maybe<Scalars['JSON']['output']>;
  /** State prior to the change. Null for create operations. */
  before?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** The affected entity if it still exists, null if deleted. */
  target?: Maybe<EditableEntity>;
  /** Discriminator for the affected entity. */
  targetKind: ChangeTargetKind;
  /** UUID of the affected entity. Survives deletion of the entity. */
  targetUuid?: Maybe<Scalars['UUID']['output']>;
  uuid: Scalars['UUID']['output'];
};

export type InstanceRootPage = PageInterface & {
  __typename?: 'InstanceRootPage';
  aliasOf?: Maybe<Page>;
  ancestors: Array<PageInterface>;
  body?: Maybe<Array<Maybe<StreamFieldInterface>>>;
  children: Array<PageInterface>;
  contentType: Scalars['String']['output'];
  depth?: Maybe<Scalars['Int']['output']>;
  descendants: Array<PageInterface>;
  draftTitle: Scalars['String']['output'];
  expireAt?: Maybe<Scalars['DateTime']['output']>;
  expired: Scalars['Boolean']['output'];
  firstPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  goLiveAt?: Maybe<Scalars['DateTime']['output']>;
  hasUnpublishedChanges: Scalars['Boolean']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  lastPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  latestRevisionCreatedAt?: Maybe<Scalars['DateTime']['output']>;
  live: Scalars['Boolean']['output'];
  locked?: Maybe<Scalars['Boolean']['output']>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedBy?: Maybe<UserType>;
  nextSiblings: Array<PageInterface>;
  numchild: Scalars['Int']['output'];
  owner?: Maybe<UserType>;
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
  path: Scalars['String']['output'];
  previousSiblings: Array<PageInterface>;
  searchDescription?: Maybe<Scalars['String']['output']>;
  searchScore?: Maybe<Scalars['Float']['output']>;
  seoTitle: Scalars['String']['output'];
  showInAdditionalLinks: Scalars['Boolean']['output'];
  showInFooter: Scalars['Boolean']['output'];
  showInMenus: Scalars['Boolean']['output'];
  siblings: Array<PageInterface>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  translationKey: Scalars['UUID']['output'];
  url?: Maybe<Scalars['String']['output']>;
  urlPath: Scalars['String']['output'];
};


export type InstanceRootPageDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  inMenu?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchOperator?: InputMaybe<SearchOperatorEnum>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type InstanceSiteContent = SnippetInterface & {
  __typename?: 'InstanceSiteContent';
  contentType: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  introContent?: Maybe<Array<Maybe<StreamFieldInterface>>>;
  snippetType: Scalars['String']['output'];
};

export type InstanceSpec = {
  __typename?: 'InstanceSpec';
  configSource: Scalars['String']['output'];
  datasetRepo?: Maybe<DatasetRepoType>;
  years: YearsDefType;
};

export type InstanceType = {
  __typename?: 'InstanceType';
  actionGroups: Array<ActionGroupType>;
  actionListPage?: Maybe<ActionListPage>;
  basePath: Scalars['String']['output'];
  defaultLanguage: Scalars['String']['output'];
  editor?: Maybe<InstanceEditor>;
  features: InstanceFeaturesType;
  goals: Array<InstanceGoalEntry>;
  hostname?: Maybe<InstanceHostname>;
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  introContent?: Maybe<Array<StreamFieldInterface>>;
  isLocked: Scalars['Boolean']['output'];
  leadParagraph?: Maybe<Scalars['String']['output']>;
  leadTitle: Scalars['String']['output'];
  maximumHistoricalYear?: Maybe<Scalars['Int']['output']>;
  minimumHistoricalYear: Scalars['Int']['output'];
  modelEndYear: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  nodes: Array<NodeInterface>;
  owner?: Maybe<Scalars['String']['output']>;
  referenceYear?: Maybe<Scalars['Int']['output']>;
  supportedLanguages: Array<Scalars['String']['output']>;
  targetYear?: Maybe<Scalars['Int']['output']>;
  themeIdentifier?: Maybe<Scalars['String']['output']>;
  uuid: Scalars['UUID']['output'];
  years: YearsDefType;
};


export type InstanceTypeGoalsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type InstanceTypeHostnameArgs = {
  hostname: Scalars['String']['input'];
};


export type InstanceTypeNodesArgs = {
  id?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type InstanceYearlyGoalType = {
  __typename?: 'InstanceYearlyGoalType';
  actual?: Maybe<Scalars['Float']['output']>;
  goal?: Maybe<Scalars['Float']['output']>;
  isForecast: Scalars['Boolean']['output'];
  isInterpolated?: Maybe<Scalars['Boolean']['output']>;
  year: Scalars['Int']['output'];
};

export type IntegerBlock = StreamFieldInterface & {
  __typename?: 'IntegerBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type ListBlock = StreamFieldInterface & {
  __typename?: 'ListBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  items: Array<StreamFieldInterface>;
  rawValue: Scalars['String']['output'];
};

export enum LowHigh {
  High = 'HIGH',
  Low = 'LOW'
}

/**
 * Represents the concrete measure for an organization-specific Instance.
 *
 * This model links a MeasureTemplate to a FrameworkConfig, allowing for
 * organization-specific instances of measures. It can override the unit
 * from the template and store internal notes.
 */
export type Measure = {
  __typename?: 'Measure';
  correspondingNode?: Maybe<NodeInterface>;
  dataPoints: Array<MeasureDataPoint>;
  frameworkConfig: FrameworkConfig;
  id: Scalars['ID']['output'];
  internalNotes: Scalars['String']['output'];
  measureTemplate: MeasureTemplate;
  placeholderDataPoints?: Maybe<Array<Maybe<PlaceHolderDataPoint>>>;
  unit?: Maybe<UnitType>;
  userPermissions?: Maybe<UserPermissions>;
  userRoles?: Maybe<Array<Scalars['String']['output']>>;
};

/**
 * Represents a specific data point for a Measure.
 *
 * This model stores the actual value for a specific year for a given Measure.
 * It provides a way to record and track the data points over time for each
 * organization-specific measure instance.
 */
export type MeasureDataPoint = {
  __typename?: 'MeasureDataPoint';
  defaultValue?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  probableLowerBound?: Maybe<Scalars['Float']['output']>;
  probableUpperBound?: Maybe<Scalars['Float']['output']>;
  userPermissions?: Maybe<UserPermissions>;
  userRoles?: Maybe<Array<Scalars['String']['output']>>;
  value?: Maybe<Scalars['Float']['output']>;
  year: Scalars['Int']['output'];
};

export type MeasureDataPointInput = {
  /** Value for the data point (set to null to remove) */
  value?: InputMaybe<Scalars['Float']['input']>;
  /** Year of the data point. If not given, defaults to the baseline year for the framework instance. */
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type MeasureInput = {
  dataPoints?: InputMaybe<Array<MeasureDataPointInput>>;
  /** Internal notes for the measure instance */
  internalNotes?: InputMaybe<Scalars['String']['input']>;
  /** ID (or UUID) of the measure template within a framework */
  measureTemplateId: Scalars['ID']['input'];
};

/**
 * Represents a template for measures within a framework.
 *
 * This model defines the structure and attributes of a measure template,
 * which is used to hold the metadata for the organization-specific
 * measure instances.
 *
 * Attributes
 * ----------
 *     section (ForeignKey): A reference to the Section this measure template belongs to.
 */
export type MeasureTemplate = {
  __typename?: 'MeasureTemplate';
  defaultDataPoints: Array<MeasureTemplateDefaultDataPoint>;
  defaultValueScaling?: Maybe<FrameworksMeasureTemplateDefaultValueScalingChoices>;
  defaultValueSource: Scalars['String']['output'];
  helpText: Scalars['String']['output'];
  hidden: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  includeInProgressTracker: Scalars['Boolean']['output'];
  maxValue?: Maybe<Scalars['Float']['output']>;
  measure?: Maybe<Measure>;
  minValue?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  priority: FrameworksMeasureTemplatePriorityChoices;
  timeSeriesMax?: Maybe<Scalars['Float']['output']>;
  unit: UnitType;
  userPermissions?: Maybe<UserPermissions>;
  userRoles?: Maybe<Array<Scalars['String']['output']>>;
  uuid: Scalars['UUID']['output'];
  yearBound: Scalars['Boolean']['output'];
};


/**
 * Represents a template for measures within a framework.
 *
 * This model defines the structure and attributes of a measure template,
 * which is used to hold the metadata for the organization-specific
 * measure instances.
 *
 * Attributes
 * ----------
 *     section (ForeignKey): A reference to the Section this measure template belongs to.
 */
export type MeasureTemplateMeasureArgs = {
  frameworkConfigId: Scalars['ID']['input'];
};

/**
 * Represents a default (fallback) value for a measure template.
 *
 * This model stores default values for specific years and category combinations
 * for a template. These fallback values can be used when actual data
 * is not available for a specific instance.
 */
export type MeasureTemplateDefaultDataPoint = {
  __typename?: 'MeasureTemplateDefaultDataPoint';
  id: Scalars['ID']['output'];
  probableLowerBound?: Maybe<Scalars['Float']['output']>;
  probableUpperBound?: Maybe<Scalars['Float']['output']>;
  userPermissions?: Maybe<UserPermissions>;
  userRoles?: Maybe<Array<Scalars['String']['output']>>;
  value: Scalars['Float']['output'];
  year: Scalars['Int']['output'];
};

export type MetricDimensionCategoryGroupType = {
  __typename?: 'MetricDimensionCategoryGroupType';
  color?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  originalId: Scalars['ID']['output'];
};

export type MetricDimensionCategoryType = {
  __typename?: 'MetricDimensionCategoryType';
  color?: Maybe<Scalars['String']['output']>;
  group?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  originalId?: Maybe<Scalars['ID']['output']>;
};

export type MetricDimensionCategoryValue = {
  __typename?: 'MetricDimensionCategoryValue';
  category: MetricDimensionCategoryType;
  dimension: MetricDimensionType;
  value?: Maybe<Scalars['Float']['output']>;
  year: Scalars['Int']['output'];
};

export type MetricDimensionType = {
  __typename?: 'MetricDimensionType';
  categories: Array<MetricDimensionCategoryType>;
  groups: Array<MetricDimensionCategoryGroupType>;
  helpText?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kind: DimensionKind;
  label: Scalars['String']['output'];
  originalId?: Maybe<Scalars['ID']['output']>;
};

export type MetricYearlyGoalType = {
  __typename?: 'MetricYearlyGoalType';
  isInterpolated: Scalars['Boolean']['output'];
  value: Scalars['Float']['output'];
  year: Scalars['Int']['output'];
};

export type MinMaxDefaultIntType = {
  __typename?: 'MinMaxDefaultIntType';
  default?: Maybe<Scalars['Int']['output']>;
  max?: Maybe<Scalars['Int']['output']>;
  min?: Maybe<Scalars['Int']['output']>;
};

/** An enumeration. */
export enum ModelAction {
  Add = 'ADD',
  Change = 'CHANGE',
  Delete = 'DELETE',
  View = 'VIEW'
}

export type Mutation = {
  __typename?: 'Mutation';
  activateScenario: ActivateScenarioResult;
  createFrameworkConfig?: Maybe<CreateFrameworkConfigMutation>;
  /** Create a new model instance under a framework, cloning from the framework template */
  createInstance: CreateInstancePayload;
  createNzcFrameworkConfig?: Maybe<CreateNzcFrameworkConfigMutation>;
  deleteFrameworkConfig?: Maybe<DeleteFrameworkConfigMutation>;
  /** Edit the nodes and edges of an instance */
  instanceEditor: InstanceEditorMutation;
  /** Register a new user with email and password */
  registerUser: RegisterUserPayload;
  resetParameter: ResetParameterResult;
  /** Set whether an instance is locked for end-user mutations */
  setInstanceLocked: SetInstanceLockedPayload;
  setNormalizer: SetNormalizerMutation;
  /** Set the value of a parameter. Customized parameters are saved in a session. */
  setParameter: SetParameterResult;
  updateFrameworkConfig?: Maybe<UpdateFrameworkConfigMutation>;
  updateMeasureDataPoint?: Maybe<UpdateMeasureDataPoint>;
  updateMeasureDataPoints?: Maybe<UpdateMeasureDataPoints>;
};


export type MutationActivateScenarioArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateFrameworkConfigArgs = {
  baselineYear: Scalars['Int']['input'];
  frameworkId: Scalars['ID']['input'];
  instanceIdentifier: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  organizationName?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['UUID']['input']>;
};


export type MutationCreateInstanceArgs = {
  input: CreateInstanceInput;
};


export type MutationCreateNzcFrameworkConfigArgs = {
  configInput: FrameworkConfigInput;
  nzcData: NzcCityEssentialData;
};


export type MutationDeleteFrameworkConfigArgs = {
  id: Scalars['ID']['input'];
};


export type MutationInstanceEditorArgs = {
  instanceId: Scalars['ID']['input'];
  version?: InputMaybe<Scalars['UUID']['input']>;
};


export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};


export type MutationResetParameterArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationSetInstanceLockedArgs = {
  instanceId: Scalars['ID']['input'];
  isLocked: Scalars['Boolean']['input'];
};


export type MutationSetNormalizerArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationSetParameterArgs = {
  boolValue?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  numberValue?: InputMaybe<Scalars['Float']['input']>;
  stringValue?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateFrameworkConfigArgs = {
  baselineYear?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  organizationIdentifier?: InputMaybe<Scalars['String']['input']>;
  organizationName?: InputMaybe<Scalars['String']['input']>;
  organizationSlug?: InputMaybe<Scalars['String']['input']>;
  targetYear?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateMeasureDataPointArgs = {
  frameworkInstanceId: Scalars['ID']['input'];
  internalNotes?: InputMaybe<Scalars['String']['input']>;
  measureTemplateId: Scalars['ID']['input'];
  value?: InputMaybe<Scalars['Float']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateMeasureDataPointsArgs = {
  frameworkConfigId: Scalars['ID']['input'];
  measures: Array<MeasureInput>;
};

export type NzcCityEssentialData = {
  /** Population of the city */
  population: Scalars['Int']['input'];
  /** Share of renewables in energy production (low or high) */
  renewableMix: LowHigh;
  /** Average yearly temperature (low or high) */
  temperature: LowHigh;
};

export type Node = EditableEntity & NodeInterface & {
  __typename?: 'Node';
  body?: Maybe<Array<StreamFieldInterface>>;
  /** Row-level change history for this node, newest first. */
  changeHistory: Array<InstanceModelLogEntryType>;
  color?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dimensionalFlow?: Maybe<DimensionalFlowType>;
  downstreamNodes: Array<NodeInterface>;
  editor?: Maybe<NodeEditor>;
  explanation?: Maybe<Scalars['String']['output']>;
  goals: Array<NodeGoal>;
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  impactMetric?: Maybe<ForecastMetricType>;
  impactMetrics: Array<ForecastMetricType>;
  inputNodes: Array<NodeInterface>;
  /** @deprecated Use __typeName instead */
  isAction: Scalars['Boolean']['output'];
  isOutcome: Scalars['Boolean']['output'];
  isVisible: Scalars['Boolean']['output'];
  kind?: Maybe<NodeKind>;
  metric?: Maybe<ForecastMetricType>;
  metricDim?: Maybe<DimensionalMetricType>;
  metrics?: Maybe<Array<ForecastMetricType>>;
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  outcome?: Maybe<DimensionalMetricType>;
  outputNodes: Array<NodeInterface>;
  parameters: Array<ParameterInterface>;
  quantity?: Maybe<Scalars['String']['output']>;
  quantityKind?: Maybe<QuantityKindType>;
  /** Stable UUID, populated for DB-backed nodes. Null for unsynced YAML nodes. */
  resolveUuid?: Maybe<Scalars['UUID']['output']>;
  shortDescription?: Maybe<Scalars['RichText']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  /** @deprecated Replaced by "goals". */
  targetYearGoal?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<UnitType>;
  upstreamActions: Array<ActionNode>;
  upstreamNodes: Array<NodeInterface>;
  uuid: Scalars['UUID']['output'];
  visualizations?: Maybe<Array<VisualizationEntry>>;
};


export type NodeChangeHistoryArgs = {
  before?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: Scalars['Int']['input'];
};


export type NodeDownstreamNodesArgs = {
  maxDepth?: InputMaybe<Scalars['Int']['input']>;
  onlyOutcome?: Scalars['Boolean']['input'];
  untilNode?: InputMaybe<Scalars['ID']['input']>;
};


export type NodeGoalsArgs = {
  activeGoal?: InputMaybe<Scalars['ID']['input']>;
};


export type NodeImpactMetricArgs = {
  goalId?: InputMaybe<Scalars['ID']['input']>;
  targetNodeId?: InputMaybe<Scalars['ID']['input']>;
};


export type NodeMetricArgs = {
  goalId?: InputMaybe<Scalars['ID']['input']>;
};


export type NodeMetricDimArgs = {
  includeScenarioKinds?: InputMaybe<Array<ScenarioKind>>;
  withScenarios?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type NodeUpstreamActionsArgs = {
  decisionLevel?: InputMaybe<DecisionLevel>;
  onlyRoot?: Scalars['Boolean']['input'];
};


export type NodeUpstreamNodesArgs = {
  includeActions?: Scalars['Boolean']['input'];
  sameQuantity?: Scalars['Boolean']['input'];
  sameUnit?: Scalars['Boolean']['input'];
};

export type NodeConfigInput = {
  action?: InputMaybe<ActionConfigInput>;
  formula?: InputMaybe<FormulaConfigInput>;
  pipeline?: InputMaybe<PipelineConfigInput>;
  simple?: InputMaybe<SimpleConfigInput>;
};

export type NodeConfigUnion = ActionConfigType | FormulaConfigType | PipelineConfigType | SimpleConfigType;

export type NodeEdgeType = EditableEntity & {
  __typename?: 'NodeEdgeType';
  /** Row-level change history for this edge, newest first. */
  changeHistory: Array<InstanceModelLogEntryType>;
  data: Array<DimensionalMetricType>;
  fromRef: NodePortRef;
  id: Scalars['ID']['output'];
  tags: Array<Scalars['String']['output']>;
  toRef: NodePortRef;
  transformations: Array<EdgeTransformationUnion>;
  uuid: Scalars['UUID']['output'];
};


export type NodeEdgeTypeChangeHistoryArgs = {
  before?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: Scalars['Int']['input'];
};

export type NodeEditor = {
  __typename?: 'NodeEditor';
  inputDimensions?: Maybe<Array<Scalars['String']['output']>>;
  layoutMeta: NodeGraphLayoutMeta;
  nodeGroup?: Maybe<Scalars['String']['output']>;
  nodeType: Scalars['String']['output'];
  outputDimensions?: Maybe<Array<Scalars['String']['output']>>;
  spec?: Maybe<NodeSpecType>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
};

export type NodeGoal = {
  __typename?: 'NodeGoal';
  value: Scalars['Float']['output'];
  year: Scalars['Int']['output'];
};

export type NodeGraphLayoutMeta = {
  __typename?: 'NodeGraphLayoutMeta';
  avgOutgoingSpan: Scalars['Float']['output'];
  canonicalRail?: Maybe<Scalars['String']['output']>;
  ghostTargets: Array<Scalars['ID']['output']>;
  ghostable: Scalars['Boolean']['output'];
  hasActionAncestor: Scalars['Boolean']['output'];
  inDegree: Scalars['Int']['output'];
  isHub: Scalars['Boolean']['output'];
  maxOutgoingSpan: Scalars['Int']['output'];
  nodeId: Scalars['ID']['output'];
  outDegree: Scalars['Int']['output'];
  primaryClass: PrimaryLayoutClass;
  topologicalLayer: Scalars['Int']['output'];
  totalDegree: Scalars['Int']['output'];
};

export type NodeInterface = {
  body?: Maybe<Array<StreamFieldInterface>>;
  /** Row-level change history for this node, newest first. */
  changeHistory: Array<InstanceModelLogEntryType>;
  color?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dimensionalFlow?: Maybe<DimensionalFlowType>;
  downstreamNodes: Array<NodeInterface>;
  editor?: Maybe<NodeEditor>;
  explanation?: Maybe<Scalars['String']['output']>;
  goals: Array<NodeGoal>;
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  impactMetric?: Maybe<ForecastMetricType>;
  impactMetrics: Array<ForecastMetricType>;
  inputNodes: Array<NodeInterface>;
  /** @deprecated Use __typeName instead */
  isAction: Scalars['Boolean']['output'];
  isVisible: Scalars['Boolean']['output'];
  kind?: Maybe<NodeKind>;
  metric?: Maybe<ForecastMetricType>;
  metricDim?: Maybe<DimensionalMetricType>;
  metrics?: Maybe<Array<ForecastMetricType>>;
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  outcome?: Maybe<DimensionalMetricType>;
  outputNodes: Array<NodeInterface>;
  parameters: Array<ParameterInterface>;
  quantity?: Maybe<Scalars['String']['output']>;
  quantityKind?: Maybe<QuantityKindType>;
  /** Stable UUID, populated for DB-backed nodes. Null for unsynced YAML nodes. */
  resolveUuid?: Maybe<Scalars['UUID']['output']>;
  shortDescription?: Maybe<Scalars['RichText']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  /** @deprecated Replaced by "goals". */
  targetYearGoal?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<UnitType>;
  upstreamNodes: Array<NodeInterface>;
  uuid: Scalars['UUID']['output'];
  visualizations?: Maybe<Array<VisualizationEntry>>;
};


export type NodeInterfaceChangeHistoryArgs = {
  before?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: Scalars['Int']['input'];
};


export type NodeInterfaceDownstreamNodesArgs = {
  maxDepth?: InputMaybe<Scalars['Int']['input']>;
  onlyOutcome?: Scalars['Boolean']['input'];
  untilNode?: InputMaybe<Scalars['ID']['input']>;
};


export type NodeInterfaceGoalsArgs = {
  activeGoal?: InputMaybe<Scalars['ID']['input']>;
};


export type NodeInterfaceImpactMetricArgs = {
  goalId?: InputMaybe<Scalars['ID']['input']>;
  targetNodeId?: InputMaybe<Scalars['ID']['input']>;
};


export type NodeInterfaceMetricArgs = {
  goalId?: InputMaybe<Scalars['ID']['input']>;
};


export type NodeInterfaceMetricDimArgs = {
  includeScenarioKinds?: InputMaybe<Array<ScenarioKind>>;
  withScenarios?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type NodeInterfaceUpstreamNodesArgs = {
  includeActions?: Scalars['Boolean']['input'];
  sameQuantity?: Scalars['Boolean']['input'];
  sameUnit?: Scalars['Boolean']['input'];
};

export enum NodeKind {
  Action = 'ACTION',
  Formula = 'FORMULA',
  Pipeline = 'PIPELINE',
  Simple = 'SIMPLE'
}

export type NodePortRef = {
  __typename?: 'NodePortRef';
  nodeId: Scalars['ID']['output'];
  portId: Scalars['UUID']['output'];
};

export type NodeSpecType = {
  __typename?: 'NodeSpecType';
  inputPorts: Array<InputPortType>;
  outputPorts: Array<OutputPortType>;
  typeConfig: NodeConfigUnion;
};

export type NormalizationType = {
  __typename?: 'NormalizationType';
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  normalizer: Node;
};

export type NormalizerNodeType = {
  __typename?: 'NormalizerNodeType';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type NumberParameterType = ParameterInterface & {
  __typename?: 'NumberParameterType';
  defaultValue?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** Global ID for the parameter in the instance */
  id: Scalars['ID']['output'];
  isCustomizable: Scalars['Boolean']['output'];
  isCustomized: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  localId?: Maybe<Scalars['ID']['output']>;
  maxValue?: Maybe<Scalars['Float']['output']>;
  minValue?: Maybe<Scalars['Float']['output']>;
  node?: Maybe<NodeInterface>;
  /** ID of parameter in the node's namespace */
  nodeRelativeId?: Maybe<Scalars['ID']['output']>;
  step?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<UnitType>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type OperationInfo = {
  __typename?: 'OperationInfo';
  /** List of messages returned by the operation. */
  messages: Array<OperationMessage>;
};

export type OperationMessage = {
  __typename?: 'OperationMessage';
  /** The error code, or `null` if no error code was set. */
  code?: Maybe<Scalars['String']['output']>;
  /** The field that caused the error, or `null` if it isn't associated with any particular field. */
  field?: Maybe<Scalars['String']['output']>;
  /** The kind of this message. */
  kind: OperationMessageKind;
  /** The error message. */
  message: Scalars['String']['output'];
};

export enum OperationMessageKind {
  Error = 'ERROR',
  Info = 'INFO',
  Permission = 'PERMISSION',
  Validation = 'VALIDATION',
  Warning = 'WARNING'
}

export type Organization = {
  __typename?: 'Organization';
  /** Short version or abbreviation of the organization name to be displayed when it is not necessary to show the full name */
  abbreviation?: Maybe<Scalars['String']['output']>;
  adminButtons: Array<AdminButton>;
  ancestors?: Maybe<Array<Maybe<Organization>>>;
  descendants?: Maybe<Array<Maybe<Organization>>>;
  description: Scalars['String']['output'];
  /** A distinct name for this organization (generated automatically) */
  distinctName?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Full name of the organization */
  name: Scalars['String']['output'];
  parent?: Maybe<Organization>;
  path: Scalars['String']['output'];
  url: Scalars['String']['output'];
  userPermissions?: Maybe<UserPermissions>;
  userRoles?: Maybe<Array<Scalars['String']['output']>>;
};

export type OutcomePage = PageInterface & {
  __typename?: 'OutcomePage';
  aliasOf?: Maybe<Page>;
  ancestors: Array<PageInterface>;
  children: Array<PageInterface>;
  contentType: Scalars['String']['output'];
  depth?: Maybe<Scalars['Int']['output']>;
  descendants: Array<PageInterface>;
  draftTitle: Scalars['String']['output'];
  expireAt?: Maybe<Scalars['DateTime']['output']>;
  expired: Scalars['Boolean']['output'];
  firstPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  goLiveAt?: Maybe<Scalars['DateTime']['output']>;
  hasUnpublishedChanges: Scalars['Boolean']['output'];
  i18n?: Maybe<Scalars['JSONString']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  latestRevisionCreatedAt?: Maybe<Scalars['DateTime']['output']>;
  leadParagraph: Scalars['String']['output'];
  leadTitle: Scalars['String']['output'];
  live: Scalars['Boolean']['output'];
  locked?: Maybe<Scalars['Boolean']['output']>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedBy?: Maybe<UserType>;
  nextSiblings: Array<PageInterface>;
  numchild: Scalars['Int']['output'];
  outcomeNode: Node;
  owner?: Maybe<UserType>;
  pagePtr: Page;
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
  path: Scalars['String']['output'];
  previousSiblings: Array<PageInterface>;
  searchDescription?: Maybe<Scalars['String']['output']>;
  searchScore?: Maybe<Scalars['Float']['output']>;
  seoTitle: Scalars['String']['output'];
  /** Should the page be shown in the additional links? */
  showInAdditionalLinks: Scalars['Boolean']['output'];
  showInFooter?: Maybe<Scalars['Boolean']['output']>;
  showInMenus: Scalars['Boolean']['output'];
  siblings: Array<PageInterface>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  translationKey: Scalars['UUID']['output'];
  url?: Maybe<Scalars['String']['output']>;
  urlPath: Scalars['String']['output'];
};


export type OutcomePageDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  inMenu?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchOperator?: InputMaybe<SearchOperatorEnum>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type OutputMetricInput = {
  columnId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  portId?: InputMaybe<Scalars['UUID']['input']>;
  quantity?: InputMaybe<Scalars['String']['input']>;
  unit: Scalars['String']['input'];
};

export type OutputPortInput = {
  columnId?: InputMaybe<Scalars['String']['input']>;
  dimensions?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isEditable?: Scalars['Boolean']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['String']['input']>;
  unit: Scalars['String']['input'];
};

export type OutputPortType = {
  __typename?: 'OutputPortType';
  columnId?: Maybe<Scalars['String']['output']>;
  dimensions: Array<Scalars['String']['output']>;
  edges: Array<NodeEdgeType>;
  id: Scalars['UUID']['output'];
  label?: Maybe<Scalars['String']['output']>;
  output?: Maybe<DimensionalMetricType>;
  quantity?: Maybe<Scalars['String']['output']>;
  unit: UnitType;
};

/**
 * Base Page type used if one isn't generated for the current model.
 * All other node types extend this.
 */
export type Page = PageInterface & {
  __typename?: 'Page';
  actionlistpage?: Maybe<ActionListPage>;
  aliasOf?: Maybe<Page>;
  aliases: Array<Page>;
  ancestors: Array<PageInterface>;
  children: Array<PageInterface>;
  contentType: Scalars['String']['output'];
  dashboardpage?: Maybe<DashboardPage>;
  depth?: Maybe<Scalars['Int']['output']>;
  descendants: Array<PageInterface>;
  draftTitle: Scalars['String']['output'];
  expireAt?: Maybe<Scalars['DateTime']['output']>;
  expired: Scalars['Boolean']['output'];
  firstPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  goLiveAt?: Maybe<Scalars['DateTime']['output']>;
  hasUnpublishedChanges: Scalars['Boolean']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  instancerootpage?: Maybe<InstanceRootPage>;
  lastPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  latestRevisionCreatedAt?: Maybe<Scalars['DateTime']['output']>;
  live: Scalars['Boolean']['output'];
  locked?: Maybe<Scalars['Boolean']['output']>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedBy?: Maybe<UserType>;
  nextSiblings: Array<PageInterface>;
  numchild: Scalars['Int']['output'];
  outcomepage?: Maybe<OutcomePage>;
  owner?: Maybe<UserType>;
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
  path: Scalars['String']['output'];
  previousSiblings: Array<PageInterface>;
  searchDescription?: Maybe<Scalars['String']['output']>;
  searchScore?: Maybe<Scalars['Float']['output']>;
  seoTitle: Scalars['String']['output'];
  showInMenus: Scalars['Boolean']['output'];
  siblings: Array<PageInterface>;
  sitesRootedHere: Array<SiteObjectType>;
  slug: Scalars['String']['output'];
  staticpage?: Maybe<StaticPage>;
  title: Scalars['String']['output'];
  translationKey: Scalars['UUID']['output'];
  url?: Maybe<Scalars['String']['output']>;
  urlPath: Scalars['String']['output'];
};


/**
 * Base Page type used if one isn't generated for the current model.
 * All other node types extend this.
 */
export type PageDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  inMenu?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchOperator?: InputMaybe<SearchOperatorEnum>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type PageChooserBlock = StreamFieldInterface & {
  __typename?: 'PageChooserBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  page?: Maybe<PageInterface>;
  rawValue: Scalars['String']['output'];
};

export type PageInterface = {
  ancestors: Array<PageInterface>;
  children: Array<PageInterface>;
  contentType: Scalars['String']['output'];
  depth?: Maybe<Scalars['Int']['output']>;
  descendants: Array<PageInterface>;
  firstPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  live: Scalars['Boolean']['output'];
  locked?: Maybe<Scalars['Boolean']['output']>;
  nextSiblings: Array<PageInterface>;
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
  previousSiblings: Array<PageInterface>;
  searchDescription?: Maybe<Scalars['String']['output']>;
  searchScore?: Maybe<Scalars['Float']['output']>;
  seoTitle: Scalars['String']['output'];
  showInMenus: Scalars['Boolean']['output'];
  siblings: Array<PageInterface>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
  urlPath: Scalars['String']['output'];
};


export type PageInterfaceDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  inMenu?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchOperator?: InputMaybe<SearchOperatorEnum>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type ParameterInterface = {
  description?: Maybe<Scalars['String']['output']>;
  /** Global ID for the parameter in the instance */
  id: Scalars['ID']['output'];
  isCustomizable: Scalars['Boolean']['output'];
  isCustomized: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  localId?: Maybe<Scalars['ID']['output']>;
  node?: Maybe<NodeInterface>;
  /** ID of parameter in the node's namespace */
  nodeRelativeId?: Maybe<Scalars['ID']['output']>;
};

export type PipelineConfigInput = {
  operations?: Array<PipelineOperationInput>;
};

export type PipelineConfigType = {
  __typename?: 'PipelineConfigType';
  operations: Scalars['JSON']['output'];
};

export type PipelineOperationInput = {
  operation: Scalars['String']['input'];
};

export type PlaceHolderDataPoint = {
  __typename?: 'PlaceHolderDataPoint';
  value?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

/** Which slice of an instance to resolve. `PUBLISHED` (default) serves the latest published revision; `DRAFT` serves the editor's in-progress state and requires edit permission on the instance. */
export enum PreviewMode {
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export enum PrimaryLayoutClass {
  Action = 'ACTION',
  ContextSource = 'CONTEXT_SOURCE',
  Core = 'CORE',
  GhostableContextSource = 'GHOSTABLE_CONTEXT_SOURCE',
  Outcome = 'OUTCOME'
}

export type PublishModelInstancePayload = InstanceType | OperationInfo;

export type QuantityKindType = {
  __typename?: 'QuantityKindType';
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActivity: Scalars['Boolean']['output'];
  isFactor: Scalars['Boolean']['output'];
  isStackable: Scalars['Boolean']['output'];
  isUnitPrice: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  qudtIri?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  action?: Maybe<ActionNode>;
  /** @deprecated Use impactOverviews instead */
  actionEfficiencyPairs: Array<ImpactOverviewType>;
  actions: Array<ActionNode>;
  activeNormalization?: Maybe<NormalizationType>;
  activeNormalizations: Array<NormalizationType>;
  activeScenario: ScenarioType;
  availableInstances: Array<InstanceBasicConfiguration>;
  availableNormalizations: Array<NormalizationType>;
  framework?: Maybe<Framework>;
  frameworks?: Maybe<Array<Framework>>;
  impactOverviews: Array<ImpactOverviewType>;
  instance: InstanceType;
  instanceOrganizations: Array<Organization>;
  me?: Maybe<UserType>;
  /** Fetch a complete model instance with all nodes, edges, and scenarios */
  modelInstance: InstanceType;
  node?: Maybe<NodeInterface>;
  nodes: Array<NodeInterface>;
  organization?: Maybe<Organization>;
  page?: Maybe<PageInterface>;
  pages: Array<PageInterface>;
  parameter?: Maybe<ParameterInterface>;
  parameters: Array<ParameterInterface>;
  scenario: ScenarioType;
  scenarios: Array<ScenarioType>;
  serverDeployment: ServerDeployment;
  unit: UnitType;
};


export type QueryActionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryActionsArgs = {
  onlyRoot?: Scalars['Boolean']['input'];
};


export type QueryAvailableInstancesArgs = {
  hostname: Scalars['String']['input'];
};


export type QueryFrameworkArgs = {
  identifier: Scalars['ID']['input'];
};


export type QueryInstanceOrganizationsArgs = {
  instance?: InputMaybe<Scalars['ID']['input']>;
  withAncestors?: Scalars['Boolean']['input'];
};


export type QueryModelInstanceArgs = {
  instanceId: Scalars['ID']['input'];
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPageArgs = {
  path: Scalars['String']['input'];
};


export type QueryPagesArgs = {
  inAdditionalLinks?: InputMaybe<Scalars['Boolean']['input']>;
  inFooter?: InputMaybe<Scalars['Boolean']['input']>;
  inMenu?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryParameterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScenarioArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUnitArgs = {
  value: Scalars['String']['input'];
};

export type RawHtmlBlock = StreamFieldInterface & {
  __typename?: 'RawHTMLBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ReferenceProgressBarBlock = StreamFieldInterface & {
  __typename?: 'ReferenceProgressBarBlock';
  blockType: Scalars['String']['output'];
  blocks: Array<StreamFieldInterface>;
  chartLabel: Scalars['String']['output'];
  color: Scalars['String']['output'];
  description: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type RegexBlock = StreamFieldInterface & {
  __typename?: 'RegexBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type RegisterUserInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  frameworkId: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type RegisterUserPayload = OperationInfo | RegisterUserResult;

export type RegisterUserResult = {
  __typename?: 'RegisterUserResult';
  email: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type ResetParameterResult = {
  __typename?: 'ResetParameterResult';
  ok: Scalars['Boolean']['output'];
};

export type RichTextBlock = StreamFieldInterface & {
  __typename?: 'RichTextBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ScenarioActionImpacts = {
  __typename?: 'ScenarioActionImpacts';
  impacts: Array<ActionImpactType>;
  scenario: ScenarioType;
};

export enum ScenarioKind {
  Baseline = 'BASELINE',
  Custom = 'CUSTOM',
  Default = 'DEFAULT',
  ProgressTracking = 'PROGRESS_TRACKING'
}

export type ScenarioParameterOverrideType = {
  __typename?: 'ScenarioParameterOverrideType';
  parameterId: Scalars['String']['output'];
  value: Scalars['JSON']['output'];
};

export type ScenarioProgressBarBlock = StreamFieldInterface & {
  __typename?: 'ScenarioProgressBarBlock';
  blockType: Scalars['String']['output'];
  blocks: Array<StreamFieldInterface>;
  chartLabel: Scalars['String']['output'];
  color: Scalars['String']['output'];
  description: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  scenarioId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ScenarioType = {
  __typename?: 'ScenarioType';
  actualHistoricalYears?: Maybe<Array<Scalars['Int']['output']>>;
  allActionsEnabled: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  isDefault: Scalars['Boolean']['output'];
  isSelectable: Scalars['Boolean']['output'];
  kind?: Maybe<ScenarioKind>;
  name: Scalars['String']['output'];
  parameterOverrides: Array<ScenarioParameterOverrideType>;
};

export type ScenarioValue = {
  __typename?: 'ScenarioValue';
  scenario: ScenarioType;
  value?: Maybe<Scalars['Float']['output']>;
  year: Scalars['Int']['output'];
};

/** Enum for search operator. */
export enum SearchOperatorEnum {
  And = 'AND',
  Or = 'OR'
}

/**
 * Represents a section within a framework.
 *
 * This model defines a hierarchical structure for organizing framework measures.
 * Each section can contain subsections and measure templates.
 */
export type Section = {
  __typename?: 'Section';
  availableYears?: Maybe<Array<Scalars['Int']['output']>>;
  children: Array<Section>;
  descendants: Array<Section>;
  description: Scalars['String']['output'];
  helpText: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  influencingMeasureTemplates: Array<MeasureTemplate>;
  maxTotal?: Maybe<Scalars['Float']['output']>;
  measureTemplates: Array<MeasureTemplate>;
  minTotal?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  parent?: Maybe<Section>;
  path: Scalars['String']['output'];
  userPermissions?: Maybe<UserPermissions>;
  userRoles?: Maybe<Array<Scalars['String']['output']>>;
  uuid: Scalars['UUID']['output'];
};

export type SelectCategoriesTransformationInput = {
  categories?: Array<Scalars['String']['input']>;
  dimension: Scalars['String']['input'];
  exclude?: Scalars['Boolean']['input'];
  flatten?: Scalars['Boolean']['input'];
};

export type SelectCategoriesTransformationType = {
  __typename?: 'SelectCategoriesTransformationType';
  categories: Array<Scalars['String']['output']>;
  dimension: Scalars['String']['output'];
  exclude: Scalars['Boolean']['output'];
  flatten: Scalars['Boolean']['output'];
};

export type ServerDeployment = {
  __typename?: 'ServerDeployment';
  buildId?: Maybe<Scalars['String']['output']>;
  deploymentType?: Maybe<Scalars['String']['output']>;
  gitRevision?: Maybe<Scalars['String']['output']>;
};

export type SetInstanceLockedPayload = OperationInfo | SetInstanceLockedResult;

export type SetInstanceLockedResult = {
  __typename?: 'SetInstanceLockedResult';
  instanceId: Scalars['ID']['output'];
  isLocked: Scalars['Boolean']['output'];
};

export type SetNormalizerMutation = {
  __typename?: 'SetNormalizerMutation';
  activeNormalizer?: Maybe<NormalizationType>;
  ok: Scalars['Boolean']['output'];
};

export type SetParameterResult = {
  __typename?: 'SetParameterResult';
  ok: Scalars['Boolean']['output'];
  parameter?: Maybe<ParameterInterface>;
};

export type SimpleConfigInput = {
  nodeClass: Scalars['String']['input'];
};

export type SimpleConfigType = {
  __typename?: 'SimpleConfigType';
  nodeClass: Scalars['String']['output'];
};

export type SiteObjectType = {
  __typename?: 'SiteObjectType';
  hostname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** If true, this site will handle requests for all other hostnames that do not have a site entry of their own */
  isDefaultSite: Scalars['Boolean']['output'];
  page?: Maybe<PageInterface>;
  pages: Array<PageInterface>;
  /** Set this to something other than 80 if you need a specific port number to appear in URLs (e.g. development on port 8000). Does not affect request handling (so port forwarding still works). */
  port: Scalars['Int']['output'];
  rootPage: Page;
  /** Human-readable name for the site. */
  siteName: Scalars['String']['output'];
};


export type SiteObjectTypePageArgs = {
  contentType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  urlPath?: InputMaybe<Scalars['String']['input']>;
};


export type SiteObjectTypePagesArgs = {
  contentType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  inMenu?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchOperator?: InputMaybe<SearchOperatorEnum>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type SnippetChooserBlock = StreamFieldInterface & {
  __typename?: 'SnippetChooserBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  snippet?: Maybe<SnippetInterface>;
};

export type SnippetInterface = {
  contentType: Scalars['String']['output'];
  snippetType: Scalars['String']['output'];
};

export type StaticBlock = StreamFieldInterface & {
  __typename?: 'StaticBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type StaticPage = PageInterface & {
  __typename?: 'StaticPage';
  aliasOf?: Maybe<Page>;
  ancestors: Array<PageInterface>;
  body?: Maybe<Array<Maybe<StreamFieldInterface>>>;
  children: Array<PageInterface>;
  contentType: Scalars['String']['output'];
  depth?: Maybe<Scalars['Int']['output']>;
  descendants: Array<PageInterface>;
  draftTitle: Scalars['String']['output'];
  expireAt?: Maybe<Scalars['DateTime']['output']>;
  expired: Scalars['Boolean']['output'];
  firstPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  goLiveAt?: Maybe<Scalars['DateTime']['output']>;
  hasUnpublishedChanges: Scalars['Boolean']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  lastPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  latestRevisionCreatedAt?: Maybe<Scalars['DateTime']['output']>;
  live: Scalars['Boolean']['output'];
  locked?: Maybe<Scalars['Boolean']['output']>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedBy?: Maybe<UserType>;
  nextSiblings: Array<PageInterface>;
  numchild: Scalars['Int']['output'];
  owner?: Maybe<UserType>;
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
  path: Scalars['String']['output'];
  previousSiblings: Array<PageInterface>;
  searchDescription?: Maybe<Scalars['String']['output']>;
  searchScore?: Maybe<Scalars['Float']['output']>;
  seoTitle: Scalars['String']['output'];
  showInAdditionalLinks: Scalars['Boolean']['output'];
  showInFooter: Scalars['Boolean']['output'];
  showInMenus: Scalars['Boolean']['output'];
  siblings: Array<PageInterface>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  translationKey: Scalars['UUID']['output'];
  url?: Maybe<Scalars['String']['output']>;
  urlPath: Scalars['String']['output'];
};


export type StaticPageDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  inMenu?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchOperator?: InputMaybe<SearchOperatorEnum>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type StreamBlock = StreamFieldInterface & {
  __typename?: 'StreamBlock';
  blockType: Scalars['String']['output'];
  blocks: Array<StreamFieldInterface>;
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
};

export type StreamFieldBlock = StreamFieldInterface & {
  __typename?: 'StreamFieldBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type StreamFieldInterface = {
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
};

export type StringParameterType = ParameterInterface & {
  __typename?: 'StringParameterType';
  defaultValue?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** Global ID for the parameter in the instance */
  id: Scalars['ID']['output'];
  isCustomizable: Scalars['Boolean']['output'];
  isCustomized: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  localId?: Maybe<Scalars['ID']['output']>;
  node?: Maybe<NodeInterface>;
  /** ID of parameter in the node's namespace */
  nodeRelativeId?: Maybe<Scalars['ID']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type StructBlock = StreamFieldInterface & {
  __typename?: 'StructBlock';
  blockType: Scalars['String']['output'];
  blocks: Array<StreamFieldInterface>;
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  availableInstances: InstanceChange;
};

export type TagObjectType = {
  __typename?: 'TagObjectType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type TestModeMutation = {
  __typename?: 'TestModeMutation';
  startCoverageTracking: Scalars['Boolean']['output'];
  stopCoverageTracking: CoverageOutput;
  switchCoverageContext: Scalars['Boolean']['output'];
};


export type TestModeMutationSwitchCoverageContextArgs = {
  context: Scalars['String']['input'];
};

export type TextBlock = StreamFieldInterface & {
  __typename?: 'TextBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type TimeBlock = StreamFieldInterface & {
  __typename?: 'TimeBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};


export type TimeBlockValueArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};

export type UrlBlock = StreamFieldInterface & {
  __typename?: 'URLBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type UnitDimensionality = {
  __typename?: 'UnitDimensionality';
  dimension: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type UnitType = {
  __typename?: 'UnitType';
  dimensionality: Array<UnitDimensionality>;
  htmlLong: Scalars['String']['output'];
  htmlShort: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  long: Scalars['String']['output'];
  short: Scalars['String']['output'];
  standard: Scalars['String']['output'];
};

export type UnknownParameterType = ParameterInterface & {
  __typename?: 'UnknownParameterType';
  description?: Maybe<Scalars['String']['output']>;
  /** Global ID for the parameter in the instance */
  id: Scalars['ID']['output'];
  isCustomizable: Scalars['Boolean']['output'];
  isCustomized: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  localId?: Maybe<Scalars['ID']['output']>;
  node?: Maybe<NodeInterface>;
  /** ID of parameter in the node's namespace */
  nodeRelativeId?: Maybe<Scalars['ID']['output']>;
};

export type UpdateDataPointInput = {
  date?: InputMaybe<Scalars['Date']['input']>;
  dimensionCategoryIds?: InputMaybe<Array<Scalars['UUID']['input']>>;
  metricId?: InputMaybe<Scalars['UUID']['input']>;
  value?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateDataPointPayload = DataPoint | OperationInfo;

export type UpdateDimensionCategoriesPayload = InstanceDimension | OperationInfo;

export type UpdateDimensionCategoryInput = {
  categoryId: Scalars['UUID']['input'];
  identifier?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  nextSibling?: InputMaybe<Scalars['ID']['input']>;
  previousSibling?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateDimensionInput = {
  dimensionId: Scalars['UUID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDimensionPayload = InstanceDimension | OperationInfo;

export type UpdateFrameworkConfigMutation = {
  __typename?: 'UpdateFrameworkConfigMutation';
  frameworkConfig?: Maybe<FrameworkConfig>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateMeasureDataPoint = {
  __typename?: 'UpdateMeasureDataPoint';
  measureDataPoint?: Maybe<MeasureDataPoint>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateMeasureDataPoints = {
  __typename?: 'UpdateMeasureDataPoints';
  createdDataPoints?: Maybe<Array<Maybe<MeasureDataPoint>>>;
  deletedDataPointCount: Scalars['Int']['output'];
  ok?: Maybe<Scalars['Boolean']['output']>;
  updatedDataPoints?: Maybe<Array<Maybe<MeasureDataPoint>>>;
};

export type UpdateNodeInput = {
  allowNulls?: InputMaybe<Scalars['Boolean']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  config?: InputMaybe<NodeConfigInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  i18n?: InputMaybe<Scalars['JSON']['input']>;
  inputDimensions?: InputMaybe<Array<Scalars['String']['input']>>;
  inputPorts?: InputMaybe<Array<InputPortInput>>;
  isOutcome?: InputMaybe<Scalars['Boolean']['input']>;
  isVisible?: InputMaybe<Scalars['Boolean']['input']>;
  kind?: InputMaybe<NodeKind>;
  minimumYear?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nodeGroup?: InputMaybe<Scalars['ID']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  outputDimensions?: InputMaybe<Array<Scalars['String']['input']>>;
  outputMetrics?: InputMaybe<Array<OutputMetricInput>>;
  outputPorts?: InputMaybe<Array<OutputPortInput>>;
  params?: InputMaybe<Scalars['JSON']['input']>;
  shortName?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateNodePayload = ActionNode | Node | OperationInfo;

export type UpdateScenarioInput = {
  allActionsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  kind?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parameterOverrides?: InputMaybe<Scalars['JSON']['input']>;
  scenarioId: Scalars['ID']['input'];
};

export type UpdateScenarioPayload = OperationInfo | ScenarioType;

export type UserFrameworkRole = {
  __typename?: 'UserFrameworkRole';
  frameworkId: Scalars['ID']['output'];
  orgId?: Maybe<Scalars['String']['output']>;
  orgSlug?: Maybe<Scalars['String']['output']>;
  roleId?: Maybe<Scalars['String']['output']>;
};

/** Permissions for a user on a model instance. */
export type UserPermissions = {
  __typename?: 'UserPermissions';
  actions: Array<Maybe<ModelAction>>;
  change: Scalars['Boolean']['output'];
  creatableRelatedModels: Array<Maybe<Scalars['String']['output']>>;
  delete: Scalars['Boolean']['output'];
  otherPermissions: Array<Maybe<Scalars['String']['output']>>;
  view: Scalars['Boolean']['output'];
};

export type UserType = {
  __typename?: 'UserType';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  frameworkRoles?: Maybe<Array<UserFrameworkRole>>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
};

export type VisualizationEntry = {
  id: Scalars['ID']['output'];
  kind: VisualizationKind;
  label?: Maybe<Scalars['String']['output']>;
};

export type VisualizationGroup = VisualizationEntry & {
  __typename?: 'VisualizationGroup';
  children: Array<VisualizationEntry>;
  id: Scalars['ID']['output'];
  kind: VisualizationKind;
  label?: Maybe<Scalars['String']['output']>;
};

export enum VisualizationKind {
  Group = 'group',
  Node = 'node'
}

export type VisualizationNodeDimension = {
  __typename?: 'VisualizationNodeDimension';
  categories?: Maybe<Array<Scalars['String']['output']>>;
  flatten?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
};

export type VisualizationNodeOutput = VisualizationEntry & {
  __typename?: 'VisualizationNodeOutput';
  desiredOutcome: DesiredOutcome;
  dimensions: Array<VisualizationNodeDimension>;
  id: Scalars['ID']['output'];
  kind: VisualizationKind;
  label?: Maybe<Scalars['String']['output']>;
  metricDim?: Maybe<DimensionalMetricType>;
  nodeId: Scalars['String']['output'];
  scenarios?: Maybe<Array<Scalars['String']['output']>>;
};

export type WedgeEntryType = {
  __typename?: 'WedgeEntryType';
  id: Scalars['ID']['output'];
  isScenario: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  metric: DimensionalMetricType;
};

export type YearlyValue = {
  __typename?: 'YearlyValue';
  value: Scalars['Float']['output'];
  year: Scalars['Int']['output'];
};

export type YearsDefType = {
  __typename?: 'YearsDefType';
  maxHistorical?: Maybe<Scalars['Int']['output']>;
  minHistorical?: Maybe<Scalars['Int']['output']>;
  modelEnd?: Maybe<Scalars['Int']['output']>;
  reference?: Maybe<Scalars['Int']['output']>;
  target?: Maybe<Scalars['Int']['output']>;
};

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String']['output'];
};

export type UpdateMeasuresMutationVariables = Exact<{
  frameworkConfigId: Scalars['ID']['input'];
  measures: Array<MeasureInput>;
}>;


export type UpdateMeasuresMutation = (
  { updateMeasureDataPoints?: (
    { ok?: boolean | null, deletedDataPointCount: number, updatedDataPoints?: Array<(
      { id: string, year: number, value?: number | null }
      & { __typename?: 'MeasureDataPoint' }
    ) | null> | null, createdDataPoints?: Array<(
      { id: string, year: number, value?: number | null }
      & { __typename?: 'MeasureDataPoint' }
    ) | null> | null }
    & { __typename?: 'UpdateMeasureDataPoints' }
  ) | null }
  & { __typename?: 'Mutation' }
);

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = (
  { me?: (
    { id: string, email: string, firstName: string, lastName: string, frameworkRoles?: Array<(
      { roleId?: string | null, orgSlug?: string | null, orgId?: string | null }
      & { __typename?: 'UserFrameworkRole' }
    )> | null }
    & { __typename?: 'UserType' }
  ) | null, framework?: (
    { id: string, userRoles?: Array<string> | null, userPermissions?: (
      { change: boolean, creatableRelatedModels: Array<string | null> }
      & { __typename?: 'UserPermissions' }
    ) | null, configs: Array<(
      { id: string, userPermissions?: (
        { view: boolean, change: boolean, delete: boolean, actions: Array<ModelAction | null>, creatableRelatedModels: Array<string | null>, otherPermissions: Array<string | null> }
        & { __typename?: 'UserPermissions' }
      ) | null }
      & { __typename: 'FrameworkConfig' }
    )> }
    & { __typename?: 'Framework' }
  ) | null }
  & { __typename?: 'Query' }
);

export type CreateNzcFrameworkMutationVariables = Exact<{
  frameworkId: Scalars['ID']['input'];
  baselineYear: Scalars['Int']['input'];
  targetYear: Scalars['Int']['input'];
  population: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  slug: Scalars['ID']['input'];
  temperature: LowHigh;
  renewableMix: LowHigh;
}>;


export type CreateNzcFrameworkMutation = (
  { createNzcFrameworkConfig?: (
    { ok: boolean, frameworkConfig?: (
      { id: string, organizationName?: string | null, baselineYear: number, targetYear?: number | null, viewUrl?: string | null, resultsDownloadUrl?: string | null, framework: (
        { id: string, configs: Array<(
          { id: string, viewUrl?: string | null, resultsDownloadUrl?: string | null, organizationName?: string | null, baselineYear: number, targetYear?: number | null }
          & { __typename?: 'FrameworkConfig' }
        )> }
        & { __typename?: 'Framework' }
      ) }
      & { __typename?: 'FrameworkConfig' }
    ) | null }
    & { __typename?: 'CreateNZCFrameworkConfigMutation' }
  ) | null }
  & { __typename?: 'Mutation' }
);

export type DeleteFrameworkMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteFrameworkMutation = (
  { deleteFrameworkConfig?: (
    { ok?: boolean | null }
    & { __typename?: 'DeleteFrameworkConfigMutation' }
  ) | null }
  & { __typename?: 'Mutation' }
);

export type GetFrameworkConfigQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFrameworkConfigQuery = (
  { framework?: (
    { id: string, config?: (
      { id: string, organizationName?: string | null, baselineYear: number, targetYear?: number | null, viewUrl?: string | null, resultsDownloadUrl?: string | null, instanceIdentifier: string, isLocked: boolean }
      & { __typename?: 'FrameworkConfig' }
    ) | null }
    & { __typename?: 'Framework' }
  ) | null }
  & { __typename?: 'Query' }
);

export type GetFrameworkConfigsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFrameworkConfigsQuery = (
  { framework?: (
    { id: string, configs: Array<(
      { id: string, organizationName?: string | null, baselineYear: number, targetYear?: number | null, viewUrl?: string | null, resultsDownloadUrl?: string | null, instanceIdentifier: string, isLocked: boolean }
      & { __typename?: 'FrameworkConfig' }
    )> }
    & { __typename?: 'Framework' }
  ) | null }
  & { __typename?: 'Query' }
);

export type GetFrameworkSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFrameworkSettingsQuery = (
  { framework?: (
    { id: string, defaults: (
      { targetYear: (
        { min?: number | null, max?: number | null, default?: number | null }
        & { __typename?: 'MinMaxDefaultIntType' }
      ), baselineYear: (
        { min?: number | null, max?: number | null, default?: number | null }
        & { __typename?: 'MinMaxDefaultIntType' }
      ) }
      & { __typename?: 'FrameworkDefaultsType' }
    ) }
    & { __typename?: 'Framework' }
  ) | null }
  & { __typename?: 'Query' }
);

export type SetInstanceLockedMutationVariables = Exact<{
  instanceId: Scalars['ID']['input'];
  isLocked: Scalars['Boolean']['input'];
}>;


export type SetInstanceLockedMutation = (
  { setInstanceLocked: { __typename: 'OperationInfo' | 'SetInstanceLockedResult' } }
  & { __typename?: 'Mutation' }
);

export type GetMeasureTemplateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  frameworkConfigId: Scalars['ID']['input'];
}>;


export type GetMeasureTemplateQuery = (
  { framework?: (
    { id: string, measureTemplate?: (
      { id: string, uuid: string, name: string, measure?: (
        { id: string, internalNotes: string, dataPoints: Array<(
          { id: string, value?: number | null, year: number, defaultValue?: number | null, probableLowerBound?: number | null, probableUpperBound?: number | null }
          & { __typename?: 'MeasureDataPoint' }
        )> }
        & { __typename?: 'Measure' }
      ) | null }
      & { __typename?: 'MeasureTemplate' }
    ) | null }
    & { __typename?: 'Framework' }
  ) | null }
  & { __typename?: 'Query' }
);

export type GetMeasureTemplatesQueryVariables = Exact<{
  frameworkConfigId: Scalars['ID']['input'];
  includePlaceholders?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetMeasureTemplatesQuery = (
  { framework?: (
    { id: string, dataCollection?: (
      { uuid: string, descendants: Array<(
        { uuid: string, name: string, minTotal?: number | null, maxTotal?: number | null, helpText: string, path: string, influencingMeasureTemplates: Array<(
          { uuid: string }
          & { __typename?: 'MeasureTemplate' }
        )>, parent?: (
          { uuid: string }
          & { __typename?: 'Section' }
        ) | null, measureTemplates: Array<(
          { id: string, uuid: string, priority: FrameworksMeasureTemplatePriorityChoices, name: string, hidden: boolean, yearBound: boolean, helpText: string, minValue?: number | null, maxValue?: number | null, includeInProgressTracker: boolean, defaultValueSource: string, unit: (
            { htmlShort: string, htmlLong: string, short: string, long: string, standard: string }
            & { __typename?: 'UnitType' }
          ), defaultDataPoints: Array<(
            { id: string, year: number, value: number }
            & { __typename?: 'MeasureTemplateDefaultDataPoint' }
          )>, measure?: (
            { id: string, internalNotes: string, placeholderDataPoints?: Array<(
              { year?: number | null, value?: number | null }
              & { __typename: 'PlaceHolderDataPoint' }
            ) | null> | null, dataPoints: Array<(
              { id: string, value?: number | null, year: number, defaultValue?: number | null, probableLowerBound?: number | null, probableUpperBound?: number | null }
              & { __typename: 'MeasureDataPoint' }
            )> }
            & { __typename: 'Measure' }
          ) | null }
          & { __typename?: 'MeasureTemplate' }
        )> }
        & { __typename: 'Section' }
      )> }
      & { __typename?: 'Section' }
    ) | null, futureAssumptions?: (
      { uuid: string, descendants: Array<(
        { uuid: string, name: string, minTotal?: number | null, maxTotal?: number | null, helpText: string, path: string, influencingMeasureTemplates: Array<(
          { uuid: string }
          & { __typename?: 'MeasureTemplate' }
        )>, parent?: (
          { uuid: string }
          & { __typename?: 'Section' }
        ) | null, measureTemplates: Array<(
          { id: string, uuid: string, priority: FrameworksMeasureTemplatePriorityChoices, name: string, hidden: boolean, yearBound: boolean, helpText: string, minValue?: number | null, maxValue?: number | null, includeInProgressTracker: boolean, defaultValueSource: string, unit: (
            { htmlShort: string, htmlLong: string, short: string, long: string, standard: string }
            & { __typename?: 'UnitType' }
          ), defaultDataPoints: Array<(
            { id: string, year: number, value: number }
            & { __typename?: 'MeasureTemplateDefaultDataPoint' }
          )>, measure?: (
            { id: string, internalNotes: string, placeholderDataPoints?: Array<(
              { year?: number | null, value?: number | null }
              & { __typename: 'PlaceHolderDataPoint' }
            ) | null> | null, dataPoints: Array<(
              { id: string, value?: number | null, year: number, defaultValue?: number | null, probableLowerBound?: number | null, probableUpperBound?: number | null }
              & { __typename: 'MeasureDataPoint' }
            )> }
            & { __typename: 'Measure' }
          ) | null }
          & { __typename?: 'MeasureTemplate' }
        )> }
        & { __typename: 'Section' }
      )> }
      & { __typename?: 'Section' }
    ) | null }
    & { __typename?: 'Framework' }
  ) | null, serverDeployment: (
    { buildId?: string | null, gitRevision?: string | null, deploymentType?: string | null }
    & { __typename?: 'ServerDeployment' }
  ) }
  & { __typename?: 'Query' }
);

export type MainSectionMeasuresFragment = (
  { uuid: string, descendants: Array<(
    { uuid: string, name: string, minTotal?: number | null, maxTotal?: number | null, helpText: string, path: string, influencingMeasureTemplates: Array<(
      { uuid: string }
      & { __typename?: 'MeasureTemplate' }
    )>, parent?: (
      { uuid: string }
      & { __typename?: 'Section' }
    ) | null, measureTemplates: Array<(
      { id: string, uuid: string, priority: FrameworksMeasureTemplatePriorityChoices, name: string, hidden: boolean, yearBound: boolean, helpText: string, minValue?: number | null, maxValue?: number | null, includeInProgressTracker: boolean, defaultValueSource: string, unit: (
        { htmlShort: string, htmlLong: string, short: string, long: string, standard: string }
        & { __typename?: 'UnitType' }
      ), defaultDataPoints: Array<(
        { id: string, year: number, value: number }
        & { __typename?: 'MeasureTemplateDefaultDataPoint' }
      )>, measure?: (
        { id: string, internalNotes: string, placeholderDataPoints?: Array<(
          { year?: number | null, value?: number | null }
          & { __typename: 'PlaceHolderDataPoint' }
        ) | null> | null, dataPoints: Array<(
          { id: string, value?: number | null, year: number, defaultValue?: number | null, probableLowerBound?: number | null, probableUpperBound?: number | null }
          & { __typename: 'MeasureDataPoint' }
        )> }
        & { __typename: 'Measure' }
      ) | null }
      & { __typename?: 'MeasureTemplate' }
    )> }
    & { __typename: 'Section' }
  )> }
  & { __typename?: 'Section' }
);

export type SectionFragmentFragment = (
  { uuid: string, name: string, minTotal?: number | null, maxTotal?: number | null, helpText: string, path: string, influencingMeasureTemplates: Array<(
    { uuid: string }
    & { __typename?: 'MeasureTemplate' }
  )>, parent?: (
    { uuid: string }
    & { __typename?: 'Section' }
  ) | null, measureTemplates: Array<(
    { id: string, uuid: string, priority: FrameworksMeasureTemplatePriorityChoices, name: string, hidden: boolean, yearBound: boolean, helpText: string, minValue?: number | null, maxValue?: number | null, includeInProgressTracker: boolean, defaultValueSource: string, unit: (
      { htmlShort: string, htmlLong: string, short: string, long: string, standard: string }
      & { __typename?: 'UnitType' }
    ), defaultDataPoints: Array<(
      { id: string, year: number, value: number }
      & { __typename?: 'MeasureTemplateDefaultDataPoint' }
    )>, measure?: (
      { id: string, internalNotes: string, placeholderDataPoints?: Array<(
        { year?: number | null, value?: number | null }
        & { __typename: 'PlaceHolderDataPoint' }
      ) | null> | null, dataPoints: Array<(
        { id: string, value?: number | null, year: number, defaultValue?: number | null, probableLowerBound?: number | null, probableUpperBound?: number | null }
        & { __typename: 'MeasureDataPoint' }
      )> }
      & { __typename: 'Measure' }
    ) | null }
    & { __typename?: 'MeasureTemplate' }
  )> }
  & { __typename: 'Section' }
);

export type MeasureTemplateFragmentFragment = (
  { id: string, uuid: string, priority: FrameworksMeasureTemplatePriorityChoices, name: string, hidden: boolean, yearBound: boolean, helpText: string, minValue?: number | null, maxValue?: number | null, includeInProgressTracker: boolean, defaultValueSource: string, unit: (
    { htmlShort: string, htmlLong: string, short: string, long: string, standard: string }
    & { __typename?: 'UnitType' }
  ), defaultDataPoints: Array<(
    { id: string, year: number, value: number }
    & { __typename?: 'MeasureTemplateDefaultDataPoint' }
  )>, measure?: (
    { id: string, internalNotes: string, placeholderDataPoints?: Array<(
      { year?: number | null, value?: number | null }
      & { __typename: 'PlaceHolderDataPoint' }
    ) | null> | null, dataPoints: Array<(
      { id: string, value?: number | null, year: number, defaultValue?: number | null, probableLowerBound?: number | null, probableUpperBound?: number | null }
      & { __typename: 'MeasureDataPoint' }
    )> }
    & { __typename: 'Measure' }
  ) | null }
  & { __typename?: 'MeasureTemplate' }
);

export type MeasureFragmentFragment = (
  { id: string, internalNotes: string, measureTemplate: (
    { uuid: string }
    & { __typename?: 'MeasureTemplate' }
  ), dataPoints: Array<(
    { value?: number | null, year: number }
    & { __typename?: 'MeasureDataPoint' }
  )> }
  & { __typename?: 'Measure' }
);

export type GetMeasuresQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMeasuresQuery = (
  { framework?: (
    { config?: (
      { measures: Array<(
        { id: string, internalNotes: string, measureTemplate: (
          { uuid: string }
          & { __typename?: 'MeasureTemplate' }
        ), dataPoints: Array<(
          { value?: number | null, year: number }
          & { __typename?: 'MeasureDataPoint' }
        )> }
        & { __typename?: 'Measure' }
      )> }
      & { __typename?: 'FrameworkConfig' }
    ) | null }
    & { __typename?: 'Framework' }
  ) | null }
  & { __typename?: 'Query' }
);

export type DataPointFragmentFragment = (
  { id: string, value?: number | null, year: number, defaultValue?: number | null, probableLowerBound?: number | null, probableUpperBound?: number | null }
  & { __typename: 'MeasureDataPoint' }
);

export type UpdateMeasureDataPointMutationVariables = Exact<{
  frameworkInstanceId: Scalars['ID']['input'];
  measureTemplateId: Scalars['ID']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
  internalNotes?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Float']['input']>;
}>;


export type UpdateMeasureDataPointMutation = (
  { updateMeasureDataPoint?: (
    { measureDataPoint?: (
      { id: string, value?: number | null, year: number, defaultValue?: number | null, probableLowerBound?: number | null, probableUpperBound?: number | null }
      & { __typename: 'MeasureDataPoint' }
    ) | null }
    & { __typename?: 'UpdateMeasureDataPoint' }
  ) | null }
  & { __typename?: 'Mutation' }
);
