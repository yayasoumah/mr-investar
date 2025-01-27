"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileIcon, Upload, Files } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileUploadDropdownProps {
  onUploadClick: () => void;
  onViewAllClick: () => void;
}

export function FileUploadDropdown({
  onUploadClick,
  onViewAllClick,
}: FileUploadDropdownProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="hover:bg-primary/5 active:scale-95 transition-all"
              >
                <FileIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={onUploadClick}
                className="flex items-center cursor-pointer"
              >
                <Upload className="mr-2 h-4 w-4 text-primary" />
                <span>Upload file</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onViewAllClick}
                className="flex items-center cursor-pointer"
              >
                <Files className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>View all files</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>
          <p>Manage files</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
