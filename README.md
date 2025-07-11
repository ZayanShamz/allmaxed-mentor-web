# 🚧 Pending / To-Do

- [ ] Applied page data fetching
- [ ] Profile page design
- [ ] migrating remaimmg queries to React Query

---

# 📘 Commit History

---

## 🔖 Commit 10-07

**Simplified Navigation State Management with Zustand**

### Summary

Replaced the previous complex navigation logic with a centralized Zustand store to handle card selection and routing.

### Highlights

- Implemented `selectCardAndNavigate` in `useSessionStore.ts` to manage card ID and URL routing atomically.
- Fixed double-click issue in `SkillstormCard` using `setTimeout` to ensure state updates before navigation.
- Updated `programs/[programId]` and `workshops/[workshopId]` to support Zustand-based state for back navigation.

### Files Modified

- `src/app/home/page.ts`
- `src/app/home/programs/[programId]/page.tsx`
- `src/app/home/workshops/[workshopId]/page.tsx`
- `src/context/useSessionStore.ts`
- `src/components/SkillstormCard.tsx`
- `src/components/AllmaxedCard.tsx`

---
