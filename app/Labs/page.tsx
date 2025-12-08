import Link from "next/link";
export default function Labs() {
  return (
    <div id="wd-labs">
      <strong>Team: </strong> Kushal Krishnappa, Anirudh N Bakare, Sai Karthikeyan Sura
      <br />
      <strong>Project: </strong> Kambaz Quizzes
      <br />
      <strong>Course: </strong> CS5610 - Web Development
      <br />
      <strong>Frontend Source Code: </strong>
      <a href="https://github.com/Coding-Huskies/kambaz">Kambaz Next.js App</a>
      <br />
      <strong>Backend Source Code: </strong>
      <a href="https://github.com/Coding-Huskies/kambaz-node-server-app">Kambaz Node Server App</a>
      <br />
      <h1>Labs</h1>
      <ul>
        <li>
          <Link href="/Labs/Lab1" id="wd-lab1-link">
            Lab 1: HTML Examples
          </Link>
        </li>
        <li>
          <Link href="/Labs/Lab2" id="wd-lab2-link">
            Lab 2: CSS Basics
          </Link>
        </li>
        <li>
          <Link href="/Labs/Lab3" id="wd-lab3-link">
            Lab 3: JavaScript Fundamentals
          </Link>
        </li>
        <li>
          <Link href="/Labs/Lab4" id="wd-lab4-link">
            Lab 4: Maintaining State in React Applications
          </Link>
        </li>
        <li>
          <Link href="/Labs/Lab5" id="wd-lab5-link">
            Lab 5: Building REST API with Node.js and Express
          </Link>
        </li>
      </ul>
    </div>
  );
}
