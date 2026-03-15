import { LobbyFloor } from '../components/organisms/floors/LobbyFloor';
import { AboutFloor } from '../components/organisms/floors/AboutFloor';
import { SkillsFloor } from '../components/organisms/floors/SkillsFloor';
import { ProjectsFloor } from '../components/organisms/floors/ProjectsFloor';
import { ContactFloor } from '../components/organisms/floors/ContactFloor';

export const FLOORS = [
  {
    id: 'lobby',
    number: 0,
    name: 'Lobby',
    shortName: 'LBY',
    component: LobbyFloor,
    color: 'var(--accent-yellow)',
  },
  {
    id: 'about',
    number: 1,
    name: 'About',
    shortName: 'ABT',
    component: AboutFloor,
    color: 'var(--accent-green)',
  },
  {
    id: 'skills',
    number: 2,
    name: 'Skills',
    shortName: 'SKL',
    component: SkillsFloor,
    color: 'var(--accent-blue)',
  },
  {
    id: 'projects',
    number: 3,
    name: 'Projects',
    shortName: 'PRJ',
    component: ProjectsFloor,
    color: 'var(--accent-purple)',
  },
  {
    id: 'contact',
    number: 4,
    name: 'Contact',
    shortName: 'CTT',
    component: ContactFloor,
    color: 'var(--accent-red)',
  },
];
