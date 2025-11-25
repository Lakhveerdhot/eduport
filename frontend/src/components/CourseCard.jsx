import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({ course, enrolled = false }){
  return (
    <Link to={`/courses/${course.id}`} className="block group">
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-150">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg group-hover:text-indigo-600">{course.title}</h3>
          {enrolled ? (
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">Enrolled</span>
          ) : (
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">View</span>
          )}
        </div>
        <div className="text-sm text-gray-600 mt-2">{course.subject} — {course.stream}</div>
        <div className="text-xs text-gray-400 mt-3">Teacher: {course.teacher?.fullName || 'TBD'}</div>
      </div>
    </Link>
  );
}
