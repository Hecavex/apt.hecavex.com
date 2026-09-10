type InclusionSnapshot = {
  source_repository: string;
  source_revision: string;
  source_sha256: string;
  source_release_id: string;
  actors: { id: string; evidence_ids: string[] }[];
};

// Inclusion is recorded against a specific frozen Labs source, not inferred from a new APT dossier.
export function labsEvidenceHandoff(snapshot: InclusionSnapshot, actorId: string, hasEvidence: boolean) {
  if (!hasEvidence || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(actorId)) return null;
  if (snapshot.source_repository !== 'Hecavex/labs.hecavex.com' || !/^[a-f0-9]{40}$/.test(snapshot.source_revision) || !/^[a-f0-9]{64}$/.test(snapshot.source_sha256)) return null;
  const matches = snapshot.actors.filter(actor => actor.id === actorId);
  if (matches.length !== 1 || !matches[0]?.evidence_ids.length || !matches[0].evidence_ids.every(id => id.startsWith(actorId + ':'))) return null;
  return { url: 'https://labs.hecavex.com/attack-map/?actor=' + encodeURIComponent(actorId), release: snapshot.source_release_id, mappings: matches[0].evidence_ids.length };
}
