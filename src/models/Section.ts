export class Section{
    sectionid: number; // primary key
    classtitle: string; // not null, not unique since there 
                        //can be more than on section of the same course.
  }
  