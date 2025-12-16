import React from 'react';
import { mockCourses } from '@/data/mockData';
import { 
  GraduationCap, 
  Play, 
  Lock, 
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Classes: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Classes & Training
        </h1>
        <p className="text-muted-foreground">
          Access exclusive training content to maximize your book's success.
        </p>
      </div>

      {/* Courses grid */}
      <div className="space-y-6">
        {mockCourses.map((course) => (
          <div 
            key={course.id}
            className={cn(
              'bg-card rounded-xl border overflow-hidden transition-all',
              course.isUnlocked ? 'border-border card-glow' : 'border-border opacity-75'
            )}
          >
            {/* Course header */}
            <div className="p-6 flex items-start gap-4">
              {/* Thumbnail placeholder */}
              <div className={cn(
                'w-24 h-24 rounded-lg flex items-center justify-center shrink-0',
                course.isUnlocked 
                  ? 'bg-gradient-to-br from-giants-red to-giants-red-dark' 
                  : 'bg-muted'
              )}>
                {course.isUnlocked ? (
                  <GraduationCap className="w-10 h-10 text-gold" />
                ) : (
                  <Lock className="w-10 h-10 text-muted-foreground" />
                )}
              </div>

              {/* Course info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      {course.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        {course.lessons.length} lessons
                      </span>
                    </div>
                  </div>

                  {!course.isUnlocked && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                </div>

                {/* Progress bar for unlocked courses */}
                {course.isUnlocked && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium text-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}
              </div>
            </div>

            {/* Lessons accordion (only for unlocked courses) */}
            {course.isUnlocked && (
              <div className="border-t border-border">
                <Accordion type="single" collapsible>
                  <AccordionItem value="lessons" className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <span className="text-sm font-medium">View Lessons</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-6 pb-4 space-y-2">
                        {course.lessons.map((lesson, index) => (
                          <div 
                            key={lesson.id}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-lg transition-colors',
                              lesson.isCompleted ? 'bg-success/5' : 'hover:bg-muted/50'
                            )}
                          >
                            {/* Lesson number/status */}
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center',
                              lesson.isCompleted 
                                ? 'bg-success text-success-foreground' 
                                : 'bg-muted text-muted-foreground'
                            )}>
                              {lesson.isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <span className="text-sm font-medium">{index + 1}</span>
                              )}
                            </div>

                            {/* Lesson info */}
                            <div className="flex-1">
                              <p className={cn(
                                'text-sm font-medium',
                                lesson.isCompleted ? 'text-success' : 'text-foreground'
                              )}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                            </div>

                            {/* Play button */}
                            <Button 
                              variant={lesson.isCompleted ? 'ghost' : 'outline'} 
                              size="sm"
                            >
                              {lesson.isCompleted ? 'Rewatch' : 'Start'}
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}

            {/* Locked course CTA */}
            {!course.isUnlocked && (
              <div className="px-6 pb-6">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    This course will unlock as you progress through your book journey.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
