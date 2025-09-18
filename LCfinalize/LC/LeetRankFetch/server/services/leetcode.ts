import { type InsertLeetcodeStats } from '@shared/schema';

export interface LeetCodeUserStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  globalRanking?: number;
}

export class LeetCodeAPI {
  private readonly graphqlUrl = 'https://leetcode.com/graphql';
  
  async getUserStats(username: string): Promise<LeetCodeUserStats | null> {
    try {
      console.log(`Fetching LeetCode stats for ${username}...`);
      
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
            profile {
              ranking
            }
          }
        }
      `;

      const response = await fetch(this.graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: JSON.stringify({
          query,
          variables: { username },
        }),
      });

      if (!response.ok) {
        console.warn(`LeetCode API failed for ${username}: ${response.status}`);
        return null;
      }

      const data = await response.json();
      const user = data.data?.matchedUser;
      
      if (!user) {
        console.warn(`User ${username} not found on LeetCode`);
        return null;
      }

      const submissions = user.submitStatsGlobal?.acSubmissionNum || [];
      let easySolved = 0;
      let mediumSolved = 0;
      let hardSolved = 0;

      submissions.forEach((sub: any) => {
        switch (sub.difficulty) {
          case 'Easy':
            easySolved = sub.count;
            break;
          case 'Medium':
            mediumSolved = sub.count;
            break;
          case 'Hard':
            hardSolved = sub.count;
            break;
        }
      });

      const totalSolved = easySolved + mediumSolved + hardSolved;
      const globalRanking = user.profile?.ranking;

      return {
        username,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        globalRanking,
      };
    } catch (error) {
      console.error(`Error fetching LeetCode stats for ${username}:`, error);
      return null;
    }
  }

  async getUserStatsWithRetry(username: string, maxRetries = 3): Promise<LeetCodeUserStats | null> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const stats = await this.getUserStats(username);
      if (stats) return stats;
      
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        console.log(`Retrying ${username} in ${delay}ms (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return null;
  }

  convertToInsertStats(stats: LeetCodeUserStats): InsertLeetcodeStats {
    return {
      username: stats.username,
      totalSolved: stats.totalSolved,
      easySolved: stats.easySolved,
      mediumSolved: stats.mediumSolved,
      hardSolved: stats.hardSolved,
      globalRanking: stats.globalRanking,
    };
  }
}

export const leetcodeAPI = new LeetCodeAPI();
