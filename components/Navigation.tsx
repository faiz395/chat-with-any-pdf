import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Link } from "lucide-react";

export default function Navigation() {
    return (
        <Sheet>
            <SheetTrigger>
                +
            </SheetTrigger>
            <SheetContent>

            <NavigationMenu className="flex items-center justify-center max-md:hidden">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" >
                    <NavigationMenuLink>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" >
                    <NavigationMenuLink>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/pricing" >
                    <NavigationMenuLink>
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
            </SheetContent>
        </Sheet>
    )
}