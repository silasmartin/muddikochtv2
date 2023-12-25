import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../home/home.page').then(m => m.HomePage)
      },
      {
        path: 'recipes',
        loadComponent: () => import('../recipes/recipes.page').then(m => m.RecipesPage)
      },
      {
        path: 'more',
        children: [
          {
            path: 'weekplan',
            loadComponent: () => import('../more/weekplan/weekplan.page').then(m => m.WeekplanPage)
          },
          {
            path: 'user',
            loadComponent: () => import('../more/user/user.page').then(m => m.UserPage)
          },
          {
            path: 'meal-categories',
            loadComponent: () => import('../more/meal-categories/meal-categories.page').then(m => m.MealCategoriesPage)
          },
          {
            path: 'meal-types',
            loadComponent: () => import('../more/meal-types/meal-types.page').then(m => m.MealTypesPage)
          },
          {
            path: 'imprint',
            loadComponent: () => import('../more/imprint/imprint.page').then(m => m.ImprintPage)
          },
          {
            path: 'privacy',
            loadComponent: () => import('../more/privacy/privacy.page').then(m => m.PrivacyPage)
          },
          {
            path: '',
            loadComponent: () => import('../more/more.page').then(m => m.MorePage)
          }
        ]
      },
      {
        path: 'generator',
        loadComponent: () => import('../generator/generator.page').then(m => m.GeneratorPage)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];
