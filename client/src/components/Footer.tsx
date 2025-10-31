export function Footer() {
  return (
    <footer 
      className="border-t border-border bg-background"
      data-testid="footer-main"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="h-12 flex items-center justify-center">
          <p className="text-sm font-medium text-muted-foreground">
            Data Source:{" "}
            <a
              href="https://data.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
              data-testid="link-data-source"
            >
              data.gov.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
