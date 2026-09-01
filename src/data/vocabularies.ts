export const confidenceValues = ['low', 'moderate', 'high'] as const;
export const actorTypes = ['state-sponsored', 'state-aligned', 'cybercriminal', 'ransomware', 'initial-access-broker', 'financially-motivated', 'hacktivist', 'mercenary', 'commercial-intrusion', 'influence-operation', 'insider', 'unknown', 'mixed'] as const;
export const motivations = ['espionage', 'financial', 'disruption', 'destruction', 'influence', 'surveillance', 'credential-access', 'access-brokerage', 'extortion', 'data-theft', 'ideological', 'unknown'] as const;
export const actorStatuses = ['active', 'intermittently-active', 'inactive', 'disrupted', 'merged', 'historical', 'uncertain'] as const;
export const aliasRelationships = ['common-alias', 'vendor-tracking-cluster', 'historical-designation', 'research-cluster', 'government-designation', 'possible-overlap', 'subgroup', 'umbrella-group', 'disputed-equivalence', 'unknown'] as const;
export const attributionStatuses = ['confirmed', 'reported', 'assessed', 'disputed', 'unknown'] as const;
export const updateTypes = [
  'profile-created', 'record-modified', 'attribution-updated', 'alias-updated',
  'targeting-updated', 'campaign-added', 'malware-added', 'technique-added',
  'source-added', 'relationship-added', 'relationship-modified',
  'relationship-removed', 'confidence-changed', 'status-changed',
  'record-deprecated', 'record-revoked', 'record-superseded',
  'source-link-status-changed', 'dataset-release', 'correction', 'editorial-update'
] as const;
export const sourceTypes = ['government', 'vendor-research', 'academic', 'legal', 'media', 'nonprofit', 'community', 'other'] as const;
export const linkStatuses = ['unknown', 'ok', 'redirected', 'unavailable'] as const;
export const balticCountries = ['Estonia', 'Latvia', 'Lithuania'] as const;
export const balticEvidenceTypes = ['reported-compromise', 'reported-targeting', 'actor-claim', 'reporting-connection'] as const;

export const confidenceDefinitions = {
  low: 'Limited or weakly corroborated public evidence; the assessment may change materially.',
  moderate: 'Credible evidence with some corroboration, but important gaps or alternative explanations remain.',
  high: 'Strong, independently corroborated evidence with limited plausible alternatives.'
} as const;
