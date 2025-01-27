"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  showExploreButton?: boolean;
}

export function EmptyState({ title, description, showExploreButton = true }: EmptyStateProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="relative h-32 w-32 mb-6">
          <Image
            src="/images/empty-state.svg"
            alt="No opportunities"
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
        {showExploreButton && (
          <Link href="/opportunities">
            <Button>
              Explore Opportunities
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
