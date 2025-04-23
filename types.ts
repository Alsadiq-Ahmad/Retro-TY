export interface Board {
    name: string
    description: string
    sectionCount: number
    sections: Section[]
  }
  
  export interface Section {
    id: string
    title: string
  }
  
  export interface Note {
    id: string
    content: string
    sectionId: string
    color: string
    votes: number
  }
  