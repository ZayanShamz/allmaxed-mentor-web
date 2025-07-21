# 🚧 Pending / To-Do

- [ ] Applied page data fetching
- [ ] Profile page design
- [ ] migrating remaining queries to React Query

---

# 📘 Commit History

---

## 🔖 Commit 21-07

## **Made some minor ui/ux changes**

### Summary

Improved card layout with consistent heights, fixed `DropdownMenu` scrollbar issue, added a subtle glow to active navbar links, and updated home page for better integration with card and navbar changes.

### Highlights

- Adjusted vertical spacing and allignment, applied count positioning for both `AllmaxedCard` and `SkillstormCard`.
- Enhanced `Sidebar` styling. Added a soft glow for active Links.
- Replaced avatar Popover with Dropdown-menu (Simpler) in `Navbar`.
- Updated Check Icon color, Select Item hover color, removed Focus rings in `Select` UI component (Radix UI/Shadcn UI).
- trying `svh` instead of `dvh` in `home/page.tsx`.
- created a separate `CHANGELOG.md` file to record changes.

### Files Modified

- [`app/globals.css`](https://github.com/ZayanShamz/allmaxed-mentor-web/blob/master/app/globals.css)
- [`src/components/AllmaxedCard.tsx`](https://github.com/ZayanShamz/allmaxed-mentor-web/blob/master/src/components/AllmaxedCard.tsx)
- [`src/components/SkillstormCard.tsx`](https://github.com/ZayanShamz/allmaxed-mentor-web/blob/master/src/components/SkillstormCard.tsx)
- [`src/components/Sidebar.tsx`](https://github.com/ZayanShamz/allmaxed-mentor-web/blob/master/src/components/Sidebar.tsx)
- [`src/components/Navbar.tsx`](https://github.com/ZayanShamz/allmaxed-mentor-web/blob/master/src/components/Navbar.tsx)
- [`src/components/ui/select.tsx`](https://github.com/ZayanShamz/allmaxed-mentor-web/blob/master/src/components/ui/select.tsx)

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
