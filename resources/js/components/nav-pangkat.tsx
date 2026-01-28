import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type MainNavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronRight } from 'lucide-react';

export function NavPangkat({ items = [] }: { items: MainNavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            {/* <SidebarGroupLabel>Kenaikan Pangkat</SidebarGroupLabel> */}
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.subItems?.some((subItem) => subItem.href === page.url)}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                            {item.subItems?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={page.url === subItem.href}>
                                    <Link href={subItem.href} prefetch>
                                    {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                    <span>{subItem.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
