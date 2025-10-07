// src/app/Components/usermaster/landing/landing.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterOutlet, Navbar, Sidebar],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  sidebarCollapsed = false;

  onToggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
