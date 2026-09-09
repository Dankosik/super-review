## C-abstractions-1: Remove unnecessary UsersFacade wrapper

- Lens and task: abstractions / go.abstractions.earn-the-boundary
- Snapshot: PR https://github.com/example/model-fixture/pull/1, H: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, comparison D: cccccccccccccccccccccccccccccccccccccccc
- Location: internal/users/lookup.go, UsersFacade (type and method, lines 4-5), Lookup (lines 6-9) at H
- Rules: go.abstractions.earn-the-boundary
- Observation and cost: UsersFacade only forwards the exact same arguments and results as Repository.Find, adding no policy, error handling, lifecycle, compatibility layer, ownership, or knowledge hiding. Lookup creates the facade instance solely to perform the delegation even though it (and any caller) already receives and depends directly on *Repository. The extra type, field, method, and allocation add indirection that must be read and understood with zero compensating benefit.
- Transformation and benefit: Delete the UsersFacade type and its Find method. Change Lookup to delegate directly:

  ```go
  func Lookup(repository *Repository, key string) string {
      return repository.Find(key)
  }
  ```

  The smallest change makes the intent visible, eliminates the wrapper, and removes the pointless creation and call chain.
- Counterargument: The facade could be a placeholder for future substitution or an interface seam, but the supplied context states explicitly that it adds no behavior, compatibility, ownership, or substitution boundary, and the complete source universe shows no such variation or external dependency to isolate.
- Preserve: Direct call semantics, error identity (none), and effect ordering are unchanged. No contracts, ownership, or lifetime are involved.
- Affected files: internal/users/lookup.go (local simplification only; no cross-file participation required)
- Missing context: none

**completed** (abstractions lens on supplied synthetic PR source; only the UsersFacade boundary implicated by the change; document/load.go RemoteStore retains its deliberate error-wrapping adapter behavior and is out of scope for this finding)
