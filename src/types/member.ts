export interface Member {
  id: string;
  name: string;
  role: "child" | "parent";
  grade: number | null;
  school: string | null;
  color: string;
}
