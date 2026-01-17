import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"

export const TabLayout = ({tabs}) => {
    return (
        <Tabs defaultValue="active" className="flex-1 flex flex-col min-h-full">
            <TabsList className="grid w-full grid-cols-2">
                { tabs.map((e) => <TabsTrigger onClick={e.onClick} value={e.value}>{e.trigger}</TabsTrigger>)}
            </TabsList>
            {tabs.map((e) => <TabsContent value={e.value} className={e.class}>{e.content}</TabsContent>)}
        </Tabs>
    )
}