/**
 * Everworld 6: Authority Registry & Domain Boundary Enforcer
 * 
 * Enforces the core architectural invariant:
 * - State paths have authoritative ownership.
 * - Ownership != Determination.
 * - Regimes != Authority.
 * - Cross-domain effects must be explicit and registered.
 */

export type DomainId =
  | "PHYSICAL_TOPOLOGY"
  | "SOMATIC_METABOLISM"
  | "COGNITIVE_EPISTEMICS"
  | "ITEM_AFFORDANCES"
  | "CONTINUOUS_ENVIRONMENT";

export interface AuthorityRule {
  readonly pathPattern: RegExp;
  readonly owningDomain: DomainId;
  readonly description: string;
}

export class AuthorityRegistry {
  private readonly rules: AuthorityRule[] = [
    {
      pathPattern: /^somatics\./,
      owningDomain: "SOMATIC_METABOLISM",
      description: "Entity physiological vitals, stamina, core integrity, adrenaline",
    },
    {
      pathPattern: /^topology\./,
      owningDomain: "PHYSICAL_TOPOLOGY",
      description: "Spatial coordinates, aperture connectivity, physical bounds",
    },
    {
      pathPattern: /^mind\./,
      owningDomain: "COGNITIVE_EPISTEMICS",
      description: "Subjective beliefs, desires, epistemic horizons, confidence scores",
    },
    {
      pathPattern: /^items\./,
      owningDomain: "ITEM_AFFORDANCES",
      description: "Equipped artifacts, resonance tuning, durability, activation states",
    },
    {
      pathPattern: /^environment\./,
      owningDomain: "CONTINUOUS_ENVIRONMENT",
      description: "Sanctum ambient temperature, magma pressure, seismic stability",
    },
  ];

  public resolveOwningDomain(path: string): DomainId | "UNOWNED" {
    for (const r of this.rules) {
      if (r.pathPattern.test(path)) {
        return r.owningDomain;
      }
    }
    return "UNOWNED";
  }

  public canDomainMutateDirectly(domainId: string, path: string): boolean {
    const owner = this.resolveOwningDomain(path);
    return owner === domainId;
  }

  public validateMutationAuthority(
    actingDomain: string,
    path: string,
    isCrossDomainCoupled: boolean
  ): { valid: boolean; reason?: string } {
    const owner = this.resolveOwningDomain(path);
    if (owner === actingDomain) {
      return { valid: true };
    }
    if (isCrossDomainCoupled) {
      return { valid: true };
    }
    return {
      valid: false,
      reason: `Unauthorized state mutation: domain '${actingDomain}' cannot directly mutate '${path}' owned by '${owner}'. Requires explicit cross-domain coupling contract.`,
    };
  }
}
