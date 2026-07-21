import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  ChevronDown, 
  Upload, 
  User, 
  Settings, 
  LogOut, 
  Home, 
  Menu,
  Moon,
  Sun,
  Loader2,
  FileText,
  Image as ImageIcon
} from "lucide-react";

const DesignSystem = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Design System</h1>
          <p className="text-muted-foreground">
            Comprehensive component library with technical references
          </p>
        </header>

        <Tabs defaultValue="buttons" className="w-full">
          <TabsList className="mb-8 flex flex-wrap h-auto gap-2">
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="texts">Texts</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="states">States</TabsTrigger>
            <TabsTrigger value="dropdowns">Dropdowns</TabsTrigger>
            <TabsTrigger value="tooltips">Tooltips</TabsTrigger>
            <TabsTrigger value="badges">Tags/Pills</TabsTrigger>
            <TabsTrigger value="forms">Form Controls</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="misc">Misc</TabsTrigger>
          </TabsList>

          {/* Buttons Tab */}
          <TabsContent value="buttons" className="space-y-8">
            <ComponentSection title="Primary Buttons" reference="button-primary">
              <div className="flex flex-wrap gap-4">
                <Button>Primary Default</Button>
                <Button rounded="full">Primary Full Rounded</Button>
                <Button rounded="sm">Primary Small Rounded</Button>
                <Button rounded="none">Primary No Rounded</Button>
                <Button disabled>Primary Disabled</Button>
              </div>
            </ComponentSection>

            <ComponentSection title="Secondary Buttons" reference="button-secondary">
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary">Secondary</Button>
                <Button variant="secondary" size="sm">Secondary Small</Button>
                <Button variant="secondary" size="lg">Secondary Large</Button>
              </div>
            </ComponentSection>

            <ComponentSection title="Outline Buttons" reference="button-outline">
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">Outline</Button>
                <Button variant="outline" size="sm">Outline Small</Button>
                <Button variant="outline" size="lg">Outline Large</Button>
              </div>
            </ComponentSection>

            <ComponentSection title="Ghost Buttons" reference="button-ghost">
              <div className="flex flex-wrap gap-4">
                <Button variant="ghost">Ghost</Button>
                <Button variant="ghost" size="sm">Ghost Small</Button>
                <Button variant="ghost" size="lg">Ghost Large</Button>
              </div>
            </ComponentSection>

            <ComponentSection title="Destructive Buttons" reference="button-destructive">
              <div className="flex flex-wrap gap-4">
                <Button variant="destructive">Delete</Button>
                <Button variant="destructive" size="sm">Remove</Button>
                <Button variant="destructive" size="lg">Destroy</Button>
              </div>
            </ComponentSection>

            <ComponentSection title="Link Buttons" reference="button-link">
              <div className="flex flex-wrap gap-4">
                <Button variant="link">Link Button</Button>
                <Button variant="link" size="sm">Small Link</Button>
              </div>
            </ComponentSection>

            <ComponentSection title="Icon Buttons" reference="button-icon">
              <div className="flex flex-wrap gap-4">
                <Button size="icon"><Settings /></Button>
                <Button size="icon" variant="outline"><User /></Button>
                <Button size="icon" variant="ghost"><Menu /></Button>
              </div>
            </ComponentSection>
          </TabsContent>

          {/* Inputs Tab */}
          <TabsContent value="inputs" className="space-y-8">
            <ComponentSection title="Text Inputs" reference="input-text">
              <div className="space-y-4 max-w-md">
                <Input placeholder="Default input" />
                <Input placeholder="Email input" type="email" />
                <Input placeholder="Password input" type="password" />
                <Input placeholder="Disabled input" disabled />
              </div>
            </ComponentSection>

            <ComponentSection title="Input with Label" reference="input-labeled">
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="File Upload" reference="input-file">
              <div className="max-w-md">
                <Label htmlFor="file" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <Input id="file" type="file" className="hidden" />
                  </div>
                </Label>
              </div>
            </ComponentSection>
          </TabsContent>

          {/* Texts Tab */}
          <TabsContent value="texts" className="space-y-8">
            <ComponentSection title="Headings" reference="text-heading">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">Heading 1 - 4xl/bold</h1>
                <h2 className="text-3xl font-bold">Heading 2 - 3xl/bold</h2>
                <h3 className="text-2xl font-semibold">Heading 3 - 2xl/semibold</h3>
                <h4 className="text-xl font-semibold">Heading 4 - xl/semibold</h4>
                <h5 className="text-lg font-medium">Heading 5 - lg/medium</h5>
                <h6 className="text-base font-medium">Heading 6 - base/medium</h6>
              </div>
            </ComponentSection>

            <ComponentSection title="Body Text" reference="text-body">
              <div className="space-y-4">
                <p className="text-base">Body text - base size (14px default)</p>
                <p className="text-sm">Small text - sm</p>
                <p className="text-xs">Extra small text - xs</p>
                <p className="text-muted-foreground">Muted foreground text</p>
                <p className="text-foreground">Foreground text</p>
              </div>
            </ComponentSection>

            <ComponentSection title="Text Weights" reference="text-weight">
              <div className="space-y-2">
                <p className="font-light">Light text - 300</p>
                <p className="font-normal">Normal text - 400</p>
                <p className="font-medium">Medium text - 500</p>
                <p className="font-semibold">Semibold text - 600</p>
                <p className="font-bold">Bold text - 700</p>
              </div>
            </ComponentSection>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-8">
            <ComponentSection title="Primary Colors" reference="color-primary">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ColorSwatch name="Primary" className="bg-primary text-primary-foreground" token="--primary" />
                <ColorSwatch name="Primary Foreground" className="bg-primary-foreground text-primary border" token="--primary-foreground" />
              </div>
            </ComponentSection>

            <ComponentSection title="Secondary Colors" reference="color-secondary">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ColorSwatch name="Secondary" className="bg-secondary text-secondary-foreground" token="--secondary" />
                <ColorSwatch name="Secondary Foreground" className="bg-secondary-foreground text-secondary border" token="--secondary-foreground" />
              </div>
            </ComponentSection>

            <ComponentSection title="Accent Colors" reference="color-accent">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ColorSwatch name="Accent" className="bg-accent text-accent-foreground" token="--accent" />
                <ColorSwatch name="Muted" className="bg-muted text-muted-foreground" token="--muted" />
              </div>
            </ComponentSection>

            <ComponentSection title="Destructive Colors" reference="color-destructive">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ColorSwatch name="Destructive" className="bg-destructive text-destructive-foreground" token="--destructive" />
              </div>
            </ComponentSection>

            <ComponentSection title="Base Colors" reference="color-base">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ColorSwatch name="Background" className="bg-background text-foreground border" token="--background" />
                <ColorSwatch name="Foreground" className="bg-foreground text-background" token="--foreground" />
                <ColorSwatch name="Border" className="bg-border" token="--border" />
              </div>
            </ComponentSection>

            <ComponentSection title="Dark Mode Toggle" reference="color-mode">
              <Button
                variant="outline"
                size="icon"
                onClick={() => document.documentElement.classList.toggle('dark')}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </ComponentSection>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-8">
            <ComponentSection title="Basic Cards" reference="card-basic">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description goes here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Card content with some example text.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Simple Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A card without description.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm">Card with content only.</p>
                  </CardContent>
                </Card>
              </div>
            </ComponentSection>

            <ComponentSection title="Profile Cards" reference="card-profile">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">Software Engineer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Avatar className="mx-auto mb-4 h-20 w-20">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-sm text-muted-foreground">Product Designer</p>
                  </CardContent>
                </Card>
              </div>
            </ComponentSection>
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="space-y-8">
            <ComponentSection title="Top Navigation" reference="nav-top">
              <Card>
                <CardContent className="p-4">
                  <nav className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="font-bold">Logo</span>
                      <div className="flex gap-4">
                        <Button variant="ghost" size="sm">Home</Button>
                        <Button variant="ghost" size="sm">Products</Button>
                        <Button variant="ghost" size="sm">About</Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">Login</Button>
                      <Button size="sm">Sign Up</Button>
                    </div>
                  </nav>
                </CardContent>
              </Card>
            </ComponentSection>

            <ComponentSection title="Side Navigation" reference="nav-side">
              <Card className="max-w-xs">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Documents
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </ComponentSection>

            <ComponentSection title="Breadcrumb" reference="nav-breadcrumb">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/products">Products</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Current Page</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </ComponentSection>
          </TabsContent>

          {/* States Tab */}
          <TabsContent value="states" className="space-y-8">
            <ComponentSection title="Loading States" reference="state-loading">
              <div className="space-y-4">
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </Button>
                <div className="space-y-2">
                  <Progress value={33} />
                  <Progress value={66} />
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="Skeleton Loaders" reference="state-skeleton">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-12 w-1/2" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="Empty States" reference="state-empty">
              <Card className="p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No data found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get started by creating your first item
                </p>
                <Button>Create New</Button>
              </Card>
            </ComponentSection>
          </TabsContent>

          {/* Dropdowns Tab */}
          <TabsContent value="dropdowns" className="space-y-8">
            <ComponentSection title="Dropdown Menu" reference="dropdown-menu">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Open Menu <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ComponentSection>

            <ComponentSection title="Popover" reference="popover">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Popover Title</h4>
                    <p className="text-sm text-muted-foreground">
                      This is a popover with some content inside.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </ComponentSection>
          </TabsContent>

          {/* Tooltips Tab */}
          <TabsContent value="tooltips" className="space-y-8">
            <ComponentSection title="Tooltips" reference="tooltip">
              <TooltipProvider>
                <div className="flex gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tooltip content</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </ComponentSection>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-8">
            <ComponentSection title="Canonical Product Badges" reference="badge-canonical">
              <div className="flex flex-wrap gap-2">
                <Badge variant="manualGraphic">Manual Graphic</Badge>
                <Badge variant="available">Available</Badge>
                <Badge variant="current">Current</Badge>
                <Badge variant="inProgress">In Progress</Badge>
                <Badge variant="pro">Pro</Badge>
              </div>
            </ComponentSection>

            <ComponentSection title="Semantic Status Badges" reference="badge-status">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Draft</Badge>
                <Badge variant="success">Active</Badge>
                <Badge variant="default">Completed</Badge>
                <Badge className="bg-warning text-warning-foreground border-transparent">Paused</Badge>
                <Badge variant="destructive">Canceled</Badge>
              </div>
            </ComponentSection>

            <ComponentSection title="Generic Badge Variants" reference="badge-default">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </ComponentSection>

            <ComponentSection title="Badge with Icons" reference="badge-icon">
              <div className="flex flex-wrap gap-2">
                <Badge>
                  <User className="mr-1 h-3 w-3" />
                  User
                </Badge>
                <Badge variant="secondary">
                  <Settings className="mr-1 h-3 w-3" />
                  Settings
                </Badge>
              </div>
            </ComponentSection>
          </TabsContent>

          {/* Form Controls Tab */}
          <TabsContent value="forms" className="space-y-8">
            <ComponentSection title="Checkbox" reference="form-checkbox">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="marketing" />
                  <Label htmlFor="marketing">Receive marketing emails</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="disabled" disabled />
                  <Label htmlFor="disabled">Disabled checkbox</Label>
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="Radio Select" reference="form-radio">
              <RadioGroup defaultValue="option-one">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">Option One</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <Label htmlFor="option-two">Option Two</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-three" id="option-three" disabled />
                  <Label htmlFor="option-three">Option Three (Disabled)</Label>
                </div>
              </RadioGroup>
            </ComponentSection>

            <ComponentSection title="Toggle Switch" reference="form-toggle">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                  <Label htmlFor="airplane-mode">Airplane Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="disabled-switch" disabled />
                  <Label htmlFor="disabled-switch">Disabled Switch</Label>
                </div>
              </div>
            </ComponentSection>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="spacing" className="space-y-8">
            <ComponentSection title="Spacing Scale" reference="spacing">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <code className="text-sm w-32">spacing-1 (p-1)</code>
                  <div className="bg-primary h-8 spacing-1">
                    <div className="bg-secondary h-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <code className="text-sm w-32">spacing-2 (p-2)</code>
                  <div className="bg-primary h-8 spacing-2">
                    <div className="bg-secondary h-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <code className="text-sm w-32">spacing-3 (p-3)</code>
                  <div className="bg-primary h-8 spacing-3">
                    <div className="bg-secondary h-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <code className="text-sm w-32">spacing-4 (p-4)</code>
                  <div className="bg-primary h-8 spacing-4">
                    <div className="bg-secondary h-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <code className="text-sm w-32">spacing-6 (p-6)</code>
                  <div className="bg-primary h-10 spacing-6">
                    <div className="bg-secondary h-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <code className="text-sm w-32">spacing-8 (p-8)</code>
                  <div className="bg-primary h-12 spacing-8">
                    <div className="bg-secondary h-full"></div>
                  </div>
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="Gap Scale" reference="gap">
              <div className="space-y-4">
                <div>
                  <code className="text-sm mb-2 block">gap-1 (0.25rem)</code>
                  <div className="flex gap-1">
                    <div className="bg-primary h-8 w-8"></div>
                    <div className="bg-primary h-8 w-8"></div>
                    <div className="bg-primary h-8 w-8"></div>
                  </div>
                </div>
                <div>
                  <code className="text-sm mb-2 block">gap-2 (0.5rem)</code>
                  <div className="flex gap-2">
                    <div className="bg-primary h-8 w-8"></div>
                    <div className="bg-primary h-8 w-8"></div>
                    <div className="bg-primary h-8 w-8"></div>
                  </div>
                </div>
                <div>
                  <code className="text-sm mb-2 block">gap-4 (1rem)</code>
                  <div className="flex gap-4">
                    <div className="bg-primary h-8 w-8"></div>
                    <div className="bg-primary h-8 w-8"></div>
                    <div className="bg-primary h-8 w-8"></div>
                  </div>
                </div>
                <div>
                  <code className="text-sm mb-2 block">gap-6 (1.5rem)</code>
                  <div className="flex gap-6">
                    <div className="bg-primary h-8 w-8"></div>
                    <div className="bg-primary h-8 w-8"></div>
                    <div className="bg-primary h-8 w-8"></div>
                  </div>
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="Border Radius" reference="border-radius">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-primary h-20 w-20 mx-auto mb-2 br-0"></div>
                  <code className="text-sm">br-0</code>
                </div>
                <div className="text-center">
                  <div className="bg-primary h-20 w-20 mx-auto mb-2 br-4"></div>
                  <code className="text-sm">br-4</code>
                </div>
                <div className="text-center">
                  <div className="bg-primary h-20 w-20 mx-auto mb-2 br-8"></div>
                  <code className="text-sm">br-8</code>
                </div>
                <div className="text-center">
                  <div className="bg-primary h-20 w-20 mx-auto mb-2 br-12"></div>
                  <code className="text-sm">br-12</code>
                </div>
                <div className="text-center">
                  <div className="bg-primary h-20 w-20 mx-auto mb-2 br-16"></div>
                  <code className="text-sm">br-16</code>
                </div>
                <div className="text-center">
                  <div className="bg-primary h-20 w-20 mx-auto mb-2 br-full"></div>
                  <code className="text-sm">br-full</code>
                </div>
              </div>
            </ComponentSection>
          </TabsContent>

          {/* Misc Tab */}
          <TabsContent value="misc" className="space-y-8">
            <ComponentSection title="Avatar" reference="avatar">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </ComponentSection>

            <ComponentSection title="Progress" reference="progress">
              <div className="space-y-4 max-w-md">
                <Progress value={0} />
                <Progress value={25} />
                <Progress value={50} />
                <Progress value={75} />
                <Progress value={100} />
              </div>
            </ComponentSection>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ComponentSection = ({ 
  title, 
  reference, 
  children 
}: { 
  title: string; 
  reference: string; 
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <code className="text-xs bg-muted px-2 py-1 rounded">{reference}</code>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const ColorSwatch = ({ 
  name, 
  className, 
  token 
}: { 
  name: string; 
  className: string; 
  token: string;
}) => (
  <div className={`p-6 rounded-lg ${className}`}>
    <p className="font-medium mb-1">{name}</p>
    <code className="text-xs opacity-80">{token}</code>
  </div>
);

export default DesignSystem;
