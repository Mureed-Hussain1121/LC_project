import { type Student, type InsertStudent, type LeetcodeStats, type InsertLeetcodeStats, type StudentWithStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Student operations
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByUsername(username: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(username: string, student: Partial<InsertStudent>): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  
  // LeetCode stats operations
  getLeetcodeStats(username: string): Promise<LeetcodeStats | undefined>;
  createOrUpdateLeetcodeStats(stats: InsertLeetcodeStats): Promise<LeetcodeStats>;
  
  // Combined operations
  getStudentsWithStats(): Promise<StudentWithStats[]>;
  
  // Utility operations
  clearAllData(): Promise<void>;
}

export class MemStorage implements IStorage {
  private students: Map<string, Student>;
  private leetcodeStats: Map<string, LeetcodeStats>;

  constructor() {
    this.students = new Map();
    this.leetcodeStats = new Map();
  }

  async getStudent(id: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(student => student.id === id);
  }

  async getStudentByUsername(username: string): Promise<Student | undefined> {
    return this.students.get(username);
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const student: Student = {
      ...insertStudent,
      id,
      skills: (insertStudent.skills as string[]) || [],
      avatarUrl: insertStudent.avatarUrl || null,
      lastUpdated: new Date(),
    };
    this.students.set(student.username, student);
    return student;
  }

  async updateStudent(username: string, studentUpdate: Partial<InsertStudent>): Promise<Student | undefined> {
    const existing = this.students.get(username);
    if (!existing) return undefined;
    
    const updated: Student = {
      ...existing,
      ...studentUpdate,
      skills: studentUpdate.skills !== undefined ? (studentUpdate.skills as string[]) : existing.skills,
      lastUpdated: new Date(),
    };
    this.students.set(username, updated);
    return updated;
  }

  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async getLeetcodeStats(username: string): Promise<LeetcodeStats | undefined> {
    return this.leetcodeStats.get(username);
  }

  async createOrUpdateLeetcodeStats(insertStats: InsertLeetcodeStats): Promise<LeetcodeStats> {
    const id = randomUUID();
    const stats: LeetcodeStats = {
      ...insertStats,
      id,
      totalSolved: insertStats.totalSolved || 0,
      easySolved: insertStats.easySolved || 0,
      mediumSolved: insertStats.mediumSolved || 0,
      hardSolved: insertStats.hardSolved || 0,
      globalRanking: insertStats.globalRanking || null,
      lastUpdated: new Date(),
    };
    this.leetcodeStats.set(stats.username, stats);
    return stats;
  }

  async getStudentsWithStats(): Promise<StudentWithStats[]> {
    const students = await this.getAllStudents();
    const studentsWithStats: StudentWithStats[] = [];
    
    for (const student of students) {
      const stats = await this.getLeetcodeStats(student.username);
      studentsWithStats.push({
        ...student,
        stats,
      });
    }
    
    return studentsWithStats;
  }

  async clearAllData(): Promise<void> {
    this.students.clear();
    this.leetcodeStats.clear();
  }
}

import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();
