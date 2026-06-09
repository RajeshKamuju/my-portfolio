/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  image: string;
  github?: string;
  demo?: string;
  createdAt?: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface AppStatus {
  database: string;
  connected: boolean;
  mongoURI: string;
}
