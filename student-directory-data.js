/* Shared frontend demo roster. Add verified students here; do not fabricate results.
   Replace localStorage with authenticated backend API for multi-device publishing. */
(function(){
 const students=[
 {id:'meezan',name:'Meezan Alam',roll:'01',photo:'images/student.jpg',percentage:96.4},
 {id:'falak',name:'Falak Fatmi',roll:null,photo:'images/student2.jpg',percentage:95.1},
 {id:'farhan',name:'Farhan Akhter',roll:null,photo:'images/student3.jpg',percentage:94.8},
 {id:'farheen',name:'Farheen Naz',roll:null,photo:'images/student4.jpg',percentage:94.7},
 {id:'akram',name:'Akram Ilahi',roll:null,photo:'images/student5.jpg',percentage:94.3},
 {id:'nishat',name:'Nishat Anjum',roll:null,photo:'images/student6.jpg',percentage:94.2}
 ];
 // Marks/quiz scores are intentionally blank until real verified data is supplied.
 students.forEach((s,i)=>{s.rank=i+1;s.marks=null;s.maxMarks=null;s.quizMarks=null;s.quizMax=null;s.quizRank=null;});
 const key=id=>'bcc_public_dedication_v1_'+id;
 function currentStudent(){
   // Demo identity only; real deployment MUST use verified authenticated user ID.
   let id='meezan';
   try {const session=JSON.parse(localStorage.getItem('bccStudentSession')||'null');
     if(session && typeof session==='object' && typeof session.studentId==='string' && students.some(s=>s.id===session.studentId))id=session.studentId;
   }catch(e){}
   return students.find(s=>s.id===id);
 }
 window.BCCStudents={students,currentStudent,getMessage(id){try{return localStorage.getItem(key(id))||''}catch(e){return ''}},saveMessage(id,msg){localStorage.setItem(key(id),msg)}};
})();
