# Last Commit: State Preserving Navigation & React Query Integration

## Overview

This commit introduces state preserving navigation to the home page and implements React Query for improved data management across the application.

## Key Changes

### 🏠 State Preserving Navigation

- **Home Page Enhancement**: Added state preserving navigation logic to maintain user context when navigating to the home page
- **URL State Management**: Implemented proper URL state handling to preserve search parameters and filters
- **Navigation Flow**: Improved user experience by maintaining application state during navigation

### 🃏 Card Components Refactoring

- **SkillstormCard.tsx**:

  - Integrated React Query mutations for withdrawal functionality
  - Added proper error handling with toast notifications
  - Implemented loading states for withdrawal operations
  - Enhanced user authentication checks before API calls

- **AllmaxedCard.tsx**:
  - Refactored API calls to use React Query mutations
  - Added withdrawal confirmation dialogs
  - Improved error handling and user feedback
  - Implemented proper loading states

### 📚 Pages Updates

- **Workshops Page & Programs Page**
- Updated to work with new state preserving navigation
- Enhanced with improved data fetching and state management

### 🔄 API Integration

- **React Query Implementation**: Replaced direct API calls with React Query mutations
- **Mutation Functions**: Created dedicated mutation functions for withdrawal operations
- **Error Handling**: Enhanced error handling with proper user feedback
- **Loading States**: Added loading indicators for better UX

## Technical Details

### New Features

- State preserving navigation system
- React Query mutation integration
- Enhanced error handling with toast notifications
- Loading state management
- Improved authentication flow

### Dependencies

- @tanstack/react-query
- react-hot-toast
- axios

### Files Modified

- `src/components/SkillstormCard.tsx`
- `src/components/AllmaxedCard.tsx`
- Workshops and Programs pages
- Navigation logic components

## Benefits

- ✅ Improved user experience with state preservation
- ✅ Better data management with React Query
- ✅ Enhanced error handling and user feedback
- ✅ More reliable API interactions
- ✅ Consistent loading states across components
