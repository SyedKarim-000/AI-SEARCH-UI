import { Routes } from '@angular/router';
import { User } from './user/user';
import { Admin } from './admin/admin';
import { Rag } from './rag/rag';

export const routes: Routes = [
	{ path: '', redirectTo: 'user', pathMatch: 'full' },
	{ path: 'user', component: User },
	{ path: 'admin', component: Admin },
	{ path: 'rag', component: Rag },
];
