import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '2025', pathMatch: 'full' },
    {
        path: '2024',
        loadComponent: () => import('./features/report-2024/report-2024.component').then(m => m.Report2024Component)
    },
    {
        path: '2025',
        loadComponent: () => import('./features/report-2025/report-2025.component').then(m => m.Report2025Component)
    }
];
