import React from 'react';
import { LobbyFloor } from '../components/organisms/floors/LobbyFloor';
import { AboutFloor } from '../components/organisms/floors/AboutFloor';
import { SkillsFloor } from '../components/organisms/floors/SkillsFloor';
import { ProjectsFloor } from '../components/organisms/floors/ProjectsFloor';
import { ContactFloor } from '../components/organisms/floors/ContactFloor';

export interface Floor {
  id: string;
  number: number;
  name: string;
  shortName: string;
  label: string;
  component: React.ComponentType<{ onNavigate?: (floor: number) => void }>;
  color: string;
}

export const FLOORS: Floor[] = [
  {
    id: 'lobby',
    number: 0,
    name: 'Lobby',
    shortName: 'LBY',
    label: 'LBY',
    component: LobbyFloor,
    color: 'var(--accent-yellow)',
  },
  {
    id: 'about',
    number: 1,
    name: 'About',
    shortName: 'ABT',
    label: 'ABT',
    component: AboutFloor,
    color: 'var(--accent-green)',
  },
  {
    id: 'skills',
    number: 2,
    name: 'Skills',
    shortName: 'SKL',
    label: 'SKL',
    component: SkillsFloor,
    color: 'var(--accent-blue)',
  },
  {
    id: 'projects',
    number: 3,
    name: 'Projects',
    shortName: 'PRJ',
    label: 'PRJ',
    component: ProjectsFloor,
    color: 'var(--accent-purple)',
  },
  {
    id: 'contact',
    number: 4,
    name: 'Contact',
    shortName: 'CTT',
    label: 'CTT',
    component: ContactFloor,
    color: 'var(--accent-red)',
  },
];
