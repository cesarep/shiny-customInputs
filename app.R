library(shiny)

source('precision.r')
source('interval.r')

ui <- fluidPage(
    titlePanel("Teste custom inputs"),
    sidebarLayout(
        sidebarPanel(
            precisionInput('precisao', 'Precisao', 0.01),
            intervalInput('intervalo', "Intervalo X", 0, 5, "De", "à", step = 0.5),
            actionButton('mudar', "Mudar valores")
        ), mainPanel(
            p("Precisao:"),
            verbatimTextOutput('prec'),
            p("Intervalo:"),
            verbatimTextOutput('intr'),
        )
    )
)

server <- function(input, output, session) {
    output$prec <- renderPrint(input$precisao)
    output$intr <- renderPrint(input$intervalo)
    
    observeEvent(input$mudar, {
        updatePrecision(session, 'precisao', value=0.01)
    })
}

shinyApp(ui = ui, server = server)
