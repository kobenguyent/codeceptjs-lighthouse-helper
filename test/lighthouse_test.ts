const { I } = inject();

Feature("Performance Check with Lighthouse")
	.config({
		chromium: {
			args: [`--remote-debugging-port=9222`],
		},
	})
Scenario("Performance check", async () => {
	I.amOnPage("https://js.devexpress.com/Demos/WidgetsGallery/Demo/Slider/Overview/jQuery/Light/");
	await I.runPerformanceCheck({ reportFileName: 'customname' });
});
