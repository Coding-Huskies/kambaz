/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa6";
import Breadcrumb from "./Breadcrumb";
import * as client from "../client";
import { setCourses } from "../reducer";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const course = courses.find((course: any) => course._id === cid);

  useEffect(() => {
    const fetchCourses = async () => {
      if (courses.length === 0) {
          const fetchedCourses = await client.findMyCourses();
          dispatch(setCourses(fetchedCourses));
      }
    };
    fetchCourses();
  }, [courses.length, dispatch]);

  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <div id="wd-courses">
      <h2>
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          onClick={() => {
            setShowSidebar(!showSidebar);
          }}
          style={{ color: "red" }}
        />
        <Breadcrumb course={course} />
      </h2>
      <hr />
      <div className="d-flex">
        {showSidebar && (
          <div>
            <CourseNavigation />
          </div>
        )}
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
