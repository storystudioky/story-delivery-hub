import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      style={{ ['--width' as string]: 'min(420px, calc(100vw - 2rem))' }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-available group-[.toaster]:text-available-foreground group-[.toaster]:border-available/60 group-[.toaster]:shadow-xl group-[.toaster]:font-medium group-[.toaster]:text-sm sm:group-[.toaster]:text-base group-[.toaster]:w-[calc(100vw-2rem)] sm:group-[.toaster]:w-[var(--width)] group-[.toaster]:max-w-[calc(100vw-2rem)] sm:group-[.toaster]:max-w-[420px] group-[.toaster]:min-w-0",
          description: "group-[.toast]:text-available-foreground/80",
          actionButton: "group-[.toast]:bg-available-foreground group-[.toast]:text-available",
          cancelButton: "group-[.toast]:bg-available-foreground/10 group-[.toast]:text-available-foreground",
          error:
            "group-[.toaster]:!bg-destructive group-[.toaster]:!text-destructive-foreground group-[.toaster]:!border-destructive/60",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
