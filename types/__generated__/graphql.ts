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
  DateTime: { input: any; output: any; }
  JSONString: { input: any; output: any; }
  PositiveInt: { input: any; output: any; }
  RichText: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type ActionEfficiency = {
  __typename?: 'ActionEfficiency';
  action: ActionNode;
  costDim: DimensionalMetricType;
  costValues: Array<Maybe<YearlyValue>>;
  efficiencyDivisor?: Maybe<Scalars['Float']['output']>;
  impactDim: DimensionalMetricType;
  impactValues: Array<Maybe<YearlyValue>>;
  unitAdjustmentMultiplier?: Maybe<Scalars['Float']['output']>;
};

export type ActionEfficiencyPairType = {
  __typename?: 'ActionEfficiencyPairType';
  actions: Array<ActionEfficiency>;
  costCutpoint?: Maybe<Scalars['Float']['output']>;
  costNode: Node;
  costUnit: UnitType;
  efficiencyUnit: UnitType;
  graphType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  impactNode: Node;
  impactUnit: UnitType;
  indicatorCutpoint?: Maybe<Scalars['Float']['output']>;
  indicatorUnit: UnitType;
  invertCost: Scalars['Boolean']['output'];
  invertImpact: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  plotLimitEfficiency?: Maybe<Scalars['Float']['output']>;
  plotLimitForIndicator?: Maybe<Scalars['Float']['output']>;
};

export type ActionGroupType = {
  __typename?: 'ActionGroupType';
  actions: Array<ActionNode>;
  color?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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
  numchild: Scalars['Int']['output'];
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
  path: Scalars['String']['output'];
  searchDescription?: Maybe<Scalars['String']['output']>;
  searchScore?: Maybe<Scalars['Float']['output']>;
  seoTitle: Scalars['String']['output'];
  showActionComparison?: Maybe<Scalars['Boolean']['output']>;
  showCumulativeImpact?: Maybe<Scalars['Boolean']['output']>;
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


export type ActionListPageAncestorsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type ActionListPageChildrenArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type ActionListPageDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type ActionListPageSiblingsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type ActionNode = NodeInterface & {
  __typename?: 'ActionNode';
  body?: Maybe<Array<StreamFieldInterface>>;
  color?: Maybe<Scalars['String']['output']>;
  decisionLevel?: Maybe<DecisionLevel>;
  description?: Maybe<Scalars['String']['output']>;
  dimensionalFlow?: Maybe<DimensionalFlowType>;
  downstreamNodes: Array<NodeInterface>;
  goal?: Maybe<Scalars['RichText']['output']>;
  goals: Array<NodeGoal>;
  group?: Maybe<ActionGroupType>;
  id: Scalars['ID']['output'];
  impactMetric?: Maybe<ForecastMetricType>;
  indicatorNode?: Maybe<Node>;
  inputNodes: Array<NodeInterface>;
  /** @deprecated Use __typeName instead */
  isAction: Scalars['Boolean']['output'];
  isEnabled: Scalars['Boolean']['output'];
  isVisible: Scalars['Boolean']['output'];
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
  shortDescription?: Maybe<Scalars['RichText']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  subactions: Array<ActionNode>;
  /** @deprecated Replaced by "goals". */
  targetYearGoal?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<UnitType>;
  upstreamNodes: Array<NodeInterface>;
};


export type ActionNodeDownstreamNodesArgs = {
  maxDepth?: InputMaybe<Scalars['Int']['input']>;
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


export type ActionNodeUpstreamNodesArgs = {
  includeActions?: InputMaybe<Scalars['Boolean']['input']>;
  sameQuantity?: InputMaybe<Scalars['Boolean']['input']>;
  sameUnit?: InputMaybe<Scalars['Boolean']['input']>;
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

export type ActivateScenarioMutation = {
  __typename?: 'ActivateScenarioMutation';
  activeScenario?: Maybe<ScenarioType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
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
  /** ID of parameter in the node's namespace */
  localId?: Maybe<Scalars['ID']['output']>;
  node?: Maybe<NodeInterface>;
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

export type CreateFrameworkInstanceMutation = {
  __typename?: 'CreateFrameworkInstanceMutation';
  ok?: Maybe<Scalars['Boolean']['output']>;
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

/** An enumeration. */
export enum DecisionLevel {
  Eu = 'EU',
  Municipality = 'MUNICIPALITY',
  Nation = 'NATION'
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
  name: Scalars['String']['output'];
  normalizedBy?: Maybe<Node>;
  stackable: Scalars['Boolean']['output'];
  unit: UnitType;
  values: Array<Maybe<Scalars['Float']['output']>>;
  years: Array<Scalars['Int']['output']>;
};

export type DocumentChooserBlock = StreamFieldInterface & {
  __typename?: 'DocumentChooserBlock';
  blockType: Scalars['String']['output'];
  document: DocumentObjectType;
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
  url: Scalars['String']['output'];
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
  /** Will be set if the node outputs multiple time-series */
  outputNode?: Maybe<Node>;
  unit?: Maybe<UnitType>;
  yearlyCumulativeUnit?: Maybe<UnitType>;
};


export type ForecastMetricTypeHistoricalValuesArgs = {
  latest?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Represents a framework for Paths models
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
 * Attributes:
 *     name (CharField): The name of the framework, limited to 200 characters.
 *     description (TextField): An optional description of the framework.
 */
export type Framework = {
  __typename?: 'Framework';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  measureTemplate?: Maybe<MeasureTemplate>;
  name: Scalars['String']['output'];
  section?: Maybe<Section>;
  sections: Array<Section>;
};


/**
 * Represents a framework for Paths models
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
 * Attributes:
 *     name (CharField): The name of the framework, limited to 200 characters.
 *     description (TextField): An optional description of the framework.
 */
export type FrameworkMeasureTemplateArgs = {
  id: Scalars['ID']['input'];
};


/**
 * Represents a framework for Paths models
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
 * Attributes:
 *     name (CharField): The name of the framework, limited to 200 characters.
 *     description (TextField): An optional description of the framework.
 */
export type FrameworkSectionArgs = {
  identifier: Scalars['ID']['input'];
};

/** An enumeration. */
export enum FrameworksMeasureTemplatePriorityChoices {
  /** High */
  High = 'HIGH',
  /** Low */
  Low = 'LOW',
  /** Medium */
  Medium = 'MEDIUM'
}

export type ImageChooserBlock = StreamFieldInterface & {
  __typename?: 'ImageChooserBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  image: ImageObjectType;
  rawValue: Scalars['String']['output'];
};

export type ImageObjectType = {
  __typename?: 'ImageObjectType';
  aspectRatio: Scalars['Float']['output'];
  collection: CollectionObjectType;
  createdAt: Scalars['DateTime']['output'];
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

export type InstanceBasicConfiguration = {
  __typename?: 'InstanceBasicConfiguration';
  defaultLanguage: Scalars['String']['output'];
  hostname: InstanceHostname;
  identifier: Scalars['String']['output'];
  isProtected: Scalars['Boolean']['output'];
  supportedLanguages: Array<Scalars['String']['output']>;
  themeIdentifier: Scalars['String']['output'];
};

export type InstanceFeaturesType = {
  __typename?: 'InstanceFeaturesType';
  baselineVisibleInGraphs: Scalars['Boolean']['output'];
  showAccumulatedEffects: Scalars['Boolean']['output'];
  showSignificantDigits: Scalars['Int']['output'];
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
  basePath?: Maybe<Scalars['String']['output']>;
  hostname?: Maybe<Scalars['String']['output']>;
};

export type InstanceRootPage = PageInterface & {
  __typename?: 'InstanceRootPage';
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
  id?: Maybe<Scalars['ID']['output']>;
  lastPublishedAt?: Maybe<Scalars['DateTime']['output']>;
  latestRevisionCreatedAt?: Maybe<Scalars['DateTime']['output']>;
  live: Scalars['Boolean']['output'];
  locked?: Maybe<Scalars['Boolean']['output']>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  numchild: Scalars['Int']['output'];
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
  path: Scalars['String']['output'];
  searchDescription?: Maybe<Scalars['String']['output']>;
  searchScore?: Maybe<Scalars['Float']['output']>;
  seoTitle: Scalars['String']['output'];
  showInFooter: Scalars['Boolean']['output'];
  showInMenus: Scalars['Boolean']['output'];
  siblings: Array<PageInterface>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  translationKey: Scalars['UUID']['output'];
  url?: Maybe<Scalars['String']['output']>;
  urlPath: Scalars['String']['output'];
};


export type InstanceRootPageAncestorsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type InstanceRootPageChildrenArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type InstanceRootPageDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type InstanceRootPageSiblingsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type InstanceSiteContent = {
  __typename?: 'InstanceSiteContent';
  id?: Maybe<Scalars['ID']['output']>;
  introContent?: Maybe<Array<Maybe<StreamFieldInterface>>>;
};

export type InstanceType = {
  __typename?: 'InstanceType';
  actionGroups: Array<ActionGroupType>;
  actionListPage?: Maybe<ActionListPage>;
  basePath: Scalars['String']['output'];
  defaultLanguage: Scalars['String']['output'];
  features: InstanceFeaturesType;
  goals: Array<InstanceGoalEntry>;
  hostname?: Maybe<InstanceHostname>;
  id: Scalars['ID']['output'];
  introContent?: Maybe<Array<StreamFieldInterface>>;
  leadParagraph?: Maybe<Scalars['String']['output']>;
  leadTitle?: Maybe<Scalars['String']['output']>;
  maximumHistoricalYear?: Maybe<Scalars['Int']['output']>;
  minimumHistoricalYear: Scalars['Int']['output'];
  modelEndYear: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  owner?: Maybe<Scalars['String']['output']>;
  referenceYear?: Maybe<Scalars['Int']['output']>;
  supportedLanguages: Array<Scalars['String']['output']>;
  targetYear?: Maybe<Scalars['Int']['output']>;
  themeIdentifier?: Maybe<Scalars['String']['output']>;
};


export type InstanceTypeGoalsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type InstanceTypeHostnameArgs = {
  hostname: Scalars['String']['input'];
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

/**
 * Represents a template for measures within a framework.
 *
 * This model defines the structure and attributes of a measure template,
 * which is used to hold the metadata for the organization-specific
 * measure instances.
 *
 * Attributes:
 *     section (ForeignKey): A reference to the Section this measure template belongs to.
 */
export type MeasureTemplate = {
  __typename?: 'MeasureTemplate';
  defaultDataPoints: Array<MeasureTemplateDefaultDataPoint>;
  defaultValueSource: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  maxValue?: Maybe<Scalars['Float']['output']>;
  minValue?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  priority: FrameworksMeasureTemplatePriorityChoices;
  timeSeriesMax?: Maybe<Scalars['Float']['output']>;
  unit: UnitType;
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

export type MetricDimensionType = {
  __typename?: 'MetricDimensionType';
  categories: Array<MetricDimensionCategoryType>;
  groups: Array<MetricDimensionCategoryGroupType>;
  helpText?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  originalId?: Maybe<Scalars['ID']['output']>;
};

export type MetricYearlyGoalType = {
  __typename?: 'MetricYearlyGoalType';
  isInterpolated: Scalars['Boolean']['output'];
  value: Scalars['Float']['output'];
  year: Scalars['Int']['output'];
};

export type Mutations = {
  __typename?: 'Mutations';
  activateScenario?: Maybe<ActivateScenarioMutation>;
  createFrameworkInstance?: Maybe<CreateFrameworkInstanceMutation>;
  resetParameter?: Maybe<ResetParameterMutation>;
  setNormalizer?: Maybe<SetNormalizerMutation>;
  setParameter?: Maybe<SetParameterMutation>;
};


export type MutationsActivateScenarioArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsCreateFrameworkInstanceArgs = {
  baselineYear: Scalars['Int']['input'];
  frameworkId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationsResetParameterArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsSetNormalizerArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsSetParameterArgs = {
  boolValue?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  numberValue?: InputMaybe<Scalars['Float']['input']>;
  stringValue?: InputMaybe<Scalars['String']['input']>;
};

export type Node = NodeInterface & {
  __typename?: 'Node';
  body?: Maybe<Array<StreamFieldInterface>>;
  color?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dimensionalFlow?: Maybe<DimensionalFlowType>;
  downstreamNodes: Array<NodeInterface>;
  goals: Array<NodeGoal>;
  id: Scalars['ID']['output'];
  impactMetric?: Maybe<ForecastMetricType>;
  inputNodes: Array<NodeInterface>;
  /** @deprecated Use __typeName instead */
  isAction: Scalars['Boolean']['output'];
  isVisible: Scalars['Boolean']['output'];
  metric?: Maybe<ForecastMetricType>;
  metricDim?: Maybe<DimensionalMetricType>;
  metrics?: Maybe<Array<ForecastMetricType>>;
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  outcome?: Maybe<DimensionalMetricType>;
  outputNodes: Array<NodeInterface>;
  parameters: Array<ParameterInterface>;
  quantity?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['RichText']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  /** @deprecated Replaced by "goals". */
  targetYearGoal?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<UnitType>;
  upstreamActions?: Maybe<Array<ActionNode>>;
  upstreamNodes: Array<NodeInterface>;
};


export type NodeDownstreamNodesArgs = {
  maxDepth?: InputMaybe<Scalars['Int']['input']>;
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


export type NodeUpstreamActionsArgs = {
  decisionLevel?: InputMaybe<DecisionLevel>;
  onlyRoot?: InputMaybe<Scalars['Boolean']['input']>;
};


export type NodeUpstreamNodesArgs = {
  includeActions?: InputMaybe<Scalars['Boolean']['input']>;
  sameQuantity?: InputMaybe<Scalars['Boolean']['input']>;
  sameUnit?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NodeGoal = {
  __typename?: 'NodeGoal';
  value: Scalars['Float']['output'];
  year: Scalars['Int']['output'];
};

export type NodeInterface = {
  body?: Maybe<Array<StreamFieldInterface>>;
  color?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dimensionalFlow?: Maybe<DimensionalFlowType>;
  downstreamNodes: Array<NodeInterface>;
  goals: Array<NodeGoal>;
  id: Scalars['ID']['output'];
  impactMetric?: Maybe<ForecastMetricType>;
  inputNodes: Array<NodeInterface>;
  /** @deprecated Use __typeName instead */
  isAction: Scalars['Boolean']['output'];
  isVisible: Scalars['Boolean']['output'];
  metric?: Maybe<ForecastMetricType>;
  metricDim?: Maybe<DimensionalMetricType>;
  metrics?: Maybe<Array<ForecastMetricType>>;
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  outcome?: Maybe<DimensionalMetricType>;
  outputNodes: Array<NodeInterface>;
  parameters: Array<ParameterInterface>;
  quantity?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['RichText']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  /** @deprecated Replaced by "goals". */
  targetYearGoal?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<UnitType>;
  upstreamNodes: Array<NodeInterface>;
};


export type NodeInterfaceDownstreamNodesArgs = {
  maxDepth?: InputMaybe<Scalars['Int']['input']>;
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


export type NodeInterfaceUpstreamNodesArgs = {
  includeActions?: InputMaybe<Scalars['Boolean']['input']>;
  sameQuantity?: InputMaybe<Scalars['Boolean']['input']>;
  sameUnit?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NormalizationType = {
  __typename?: 'NormalizationType';
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  normalizer: Node;
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
  /** ID of parameter in the node's namespace */
  localId?: Maybe<Scalars['ID']['output']>;
  maxValue?: Maybe<Scalars['Float']['output']>;
  minValue?: Maybe<Scalars['Float']['output']>;
  node?: Maybe<NodeInterface>;
  nodeRelativeId?: Maybe<Scalars['ID']['output']>;
  step?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<UnitType>;
  value?: Maybe<Scalars['Float']['output']>;
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
  numchild: Scalars['Int']['output'];
  outcomeNode: Node;
  pagePtr: Page;
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
  path: Scalars['String']['output'];
  searchDescription?: Maybe<Scalars['String']['output']>;
  searchScore?: Maybe<Scalars['Float']['output']>;
  seoTitle: Scalars['String']['output'];
  showInFooter?: Maybe<Scalars['Boolean']['output']>;
  showInMenus: Scalars['Boolean']['output'];
  siblings: Array<PageInterface>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  translationKey: Scalars['UUID']['output'];
  url?: Maybe<Scalars['String']['output']>;
  urlPath: Scalars['String']['output'];
};


export type OutcomePageAncestorsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type OutcomePageChildrenArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type OutcomePageDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type OutcomePageSiblingsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
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
  numchild: Scalars['Int']['output'];
  outcomepage?: Maybe<OutcomePage>;
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
  path: Scalars['String']['output'];
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
export type PageAncestorsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Base Page type used if one isn't generated for the current model.
 * All other node types extend this.
 */
export type PageChildrenArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Base Page type used if one isn't generated for the current model.
 * All other node types extend this.
 */
export type PageDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Base Page type used if one isn't generated for the current model.
 * All other node types extend this.
 */
export type PageSiblingsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type PageChooserBlock = StreamFieldInterface & {
  __typename?: 'PageChooserBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  page: PageInterface;
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
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
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


export type PageInterfaceAncestorsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type PageInterfaceChildrenArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type PageInterfaceDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type PageInterfaceSiblingsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type ParameterInterface = {
  description?: Maybe<Scalars['String']['output']>;
  /** Global ID for the parameter in the instance */
  id: Scalars['ID']['output'];
  isCustomizable: Scalars['Boolean']['output'];
  isCustomized: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  /** ID of parameter in the node's namespace */
  localId?: Maybe<Scalars['ID']['output']>;
  node?: Maybe<NodeInterface>;
  nodeRelativeId?: Maybe<Scalars['ID']['output']>;
};

export type Query = {
  __typename?: 'Query';
  action?: Maybe<ActionNode>;
  actionEfficiencyPairs: Array<ActionEfficiencyPairType>;
  actions: Array<ActionNode>;
  activeNormalization?: Maybe<NormalizationType>;
  activeScenario?: Maybe<ScenarioType>;
  availableInstances: Array<InstanceBasicConfiguration>;
  availableNormalizations: Array<NormalizationType>;
  framework?: Maybe<Framework>;
  frameworks?: Maybe<Array<Framework>>;
  impactOverviews: Array<ActionEfficiencyPairType>;
  instance: InstanceType;
  node?: Maybe<NodeInterface>;
  nodes: Array<NodeInterface>;
  page?: Maybe<PageInterface>;
  pages: Array<PageInterface>;
  parameter?: Maybe<ParameterInterface>;
  parameters: Array<ParameterInterface>;
  scenario?: Maybe<ScenarioType>;
  scenarios: Array<ScenarioType>;
  serverDeployment: ServerDeployment;
  unit?: Maybe<UnitType>;
};


export type QueryActionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryActionsArgs = {
  onlyRoot?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAvailableInstancesArgs = {
  hostname?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFrameworkArgs = {
  identifier: Scalars['ID']['input'];
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPageArgs = {
  path: Scalars['String']['input'];
};


export type QueryPagesArgs = {
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

export type RegexBlock = StreamFieldInterface & {
  __typename?: 'RegexBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ResetParameterMutation = {
  __typename?: 'ResetParameterMutation';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type RichTextBlock = StreamFieldInterface & {
  __typename?: 'RichTextBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ScenarioType = {
  __typename?: 'ScenarioType';
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isDefault?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

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
  id: Scalars['ID']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  measureTemplates: Array<MeasureTemplate>;
  name: Scalars['String']['output'];
  parent?: Maybe<Section>;
  path: Scalars['String']['output'];
};

export type ServerDeployment = {
  __typename?: 'ServerDeployment';
  buildId?: Maybe<Scalars['String']['output']>;
  deploymentType?: Maybe<Scalars['String']['output']>;
  gitRevision?: Maybe<Scalars['String']['output']>;
};

export type SetNormalizerMutation = {
  __typename?: 'SetNormalizerMutation';
  activeNormalization?: Maybe<NormalizationType>;
  ok: Scalars['Boolean']['output'];
};

export type SetParameterMutation = {
  __typename?: 'SetParameterMutation';
  ok?: Maybe<Scalars['Boolean']['output']>;
  parameter?: Maybe<ParameterInterface>;
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
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type SnippetChooserBlock = StreamFieldInterface & {
  __typename?: 'SnippetChooserBlock';
  blockType: Scalars['String']['output'];
  field: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  rawValue: Scalars['String']['output'];
  snippet: SnippetObjectType;
};

export type SnippetObjectType = InstanceSiteContent;

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
  numchild: Scalars['Int']['output'];
  pageType?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<PageInterface>;
  path: Scalars['String']['output'];
  searchDescription?: Maybe<Scalars['String']['output']>;
  searchScore?: Maybe<Scalars['Float']['output']>;
  seoTitle: Scalars['String']['output'];
  showInFooter: Scalars['Boolean']['output'];
  showInMenus: Scalars['Boolean']['output'];
  siblings: Array<PageInterface>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  translationKey: Scalars['UUID']['output'];
  url?: Maybe<Scalars['String']['output']>;
  urlPath: Scalars['String']['output'];
};


export type StaticPageAncestorsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type StaticPageChildrenArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type StaticPageDescendantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};


export type StaticPageSiblingsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['PositiveInt']['input']>;
  offset?: InputMaybe<Scalars['PositiveInt']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
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
  /** ID of parameter in the node's namespace */
  localId?: Maybe<Scalars['ID']['output']>;
  node?: Maybe<NodeInterface>;
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

export type TagObjectType = {
  __typename?: 'TagObjectType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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

export type UnitType = {
  __typename?: 'UnitType';
  htmlLong: Scalars['String']['output'];
  htmlShort: Scalars['String']['output'];
  long: Scalars['String']['output'];
  short: Scalars['String']['output'];
};

export type UnknownParameterType = ParameterInterface & {
  __typename?: 'UnknownParameterType';
  description?: Maybe<Scalars['String']['output']>;
  /** Global ID for the parameter in the instance */
  id: Scalars['ID']['output'];
  isCustomizable: Scalars['Boolean']['output'];
  isCustomized: Scalars['Boolean']['output'];
  label?: Maybe<Scalars['String']['output']>;
  /** ID of parameter in the node's namespace */
  localId?: Maybe<Scalars['ID']['output']>;
  node?: Maybe<NodeInterface>;
  nodeRelativeId?: Maybe<Scalars['ID']['output']>;
};

export type YearlyValue = {
  __typename?: 'YearlyValue';
  value: Scalars['Float']['output'];
  year: Scalars['Int']['output'];
};

export type GetMeasureTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeasureTemplatesQuery = (
  { framework?: (
    { dataCollection?: (
      { id: string, descendants: Array<(
        { id: string, name: string, path: string, parent?: (
          { id: string }
          & { __typename?: 'Section' }
        ) | null, measureTemplates: Array<(
          { id: string, priority: FrameworksMeasureTemplatePriorityChoices, name: string, defaultValueSource: string, unit: (
            { htmlShort: string }
            & { __typename?: 'UnitType' }
          ), defaultDataPoints: Array<(
            { id: string, year: number, value: number }
            & { __typename?: 'MeasureTemplateDefaultDataPoint' }
          )> }
          & { __typename?: 'MeasureTemplate' }
        )> }
        & { __typename?: 'Section' }
      )> }
      & { __typename?: 'Section' }
    ) | null, futureAssumptions?: (
      { id: string, descendants: Array<(
        { id: string, name: string, path: string, parent?: (
          { id: string }
          & { __typename?: 'Section' }
        ) | null, measureTemplates: Array<(
          { id: string, priority: FrameworksMeasureTemplatePriorityChoices, name: string, defaultValueSource: string, unit: (
            { htmlShort: string }
            & { __typename?: 'UnitType' }
          ), defaultDataPoints: Array<(
            { id: string, year: number, value: number }
            & { __typename?: 'MeasureTemplateDefaultDataPoint' }
          )> }
          & { __typename?: 'MeasureTemplate' }
        )> }
        & { __typename?: 'Section' }
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
  { id: string, descendants: Array<(
    { id: string, name: string, path: string, parent?: (
      { id: string }
      & { __typename?: 'Section' }
    ) | null, measureTemplates: Array<(
      { id: string, priority: FrameworksMeasureTemplatePriorityChoices, name: string, defaultValueSource: string, unit: (
        { htmlShort: string }
        & { __typename?: 'UnitType' }
      ), defaultDataPoints: Array<(
        { id: string, year: number, value: number }
        & { __typename?: 'MeasureTemplateDefaultDataPoint' }
      )> }
      & { __typename?: 'MeasureTemplate' }
    )> }
    & { __typename?: 'Section' }
  )> }
  & { __typename?: 'Section' }
);

export type SectionFragmentFragment = (
  { id: string, name: string, path: string, parent?: (
    { id: string }
    & { __typename?: 'Section' }
  ) | null, measureTemplates: Array<(
    { id: string, priority: FrameworksMeasureTemplatePriorityChoices, name: string, defaultValueSource: string, unit: (
      { htmlShort: string }
      & { __typename?: 'UnitType' }
    ), defaultDataPoints: Array<(
      { id: string, year: number, value: number }
      & { __typename?: 'MeasureTemplateDefaultDataPoint' }
    )> }
    & { __typename?: 'MeasureTemplate' }
  )> }
  & { __typename?: 'Section' }
);
