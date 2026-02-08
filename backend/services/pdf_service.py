
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from io import BytesIO
import logging

logger = logging.getLogger("venturescout.pdf")

class PDFService:
    """
    Generates an institutional-grade Investment Memo PDF.
    Utilizes ReportLab for precise layout and professional aesthetics.
    """
    def generate_memo_pdf(self, analysis: dict) -> bytes:
        logger.info(f"Generating professional PDF for {analysis.get('companyName')}")
        buffer = BytesIO()
        
        # Document setup
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=letter, 
            rightMargin=72, 
            leftMargin=72, 
            topMargin=72, 
            bottomMargin=18
        )
        
        styles = getSampleStyleSheet()
        
        # Custom Internal Styles
        styles.add(ParagraphStyle(
            name='SectionHeader', 
            fontSize=14, 
            spaceAfter=12, 
            spaceBefore=18, 
            color=colors.HexColor("#312e81"), # Indigo 900
            fontName='Helvetica-Bold'
        ))
        
        elements = []
        
        # 1. Header & Title
        elements.append(Paragraph(f"INVESTMENT MEMO: {analysis.get('companyName')}", styles['Title']))
        elements.append(Paragraph(f"Sector: {analysis.get('sector')} | Verdict: {analysis.get('verdict')}", styles['Normal']))
        elements.append(Spacer(1, 12))
        
        # 2. Scorecard Table
        elements.append(Paragraph("Venture Scorecard", styles['SectionHeader']))
        scores = analysis.get('scores', {})
        data = [
            ['Category', 'Score (%)'],
            ['Team', f"{scores.get('team', 0)}%"],
            ['Product', f"{scores.get('product', 0)}%"],
            ['Market', f"{scores.get('market', 0)}%"],
            ['Traction', f"{scores.get('traction', 0)}%"],
            ['Overall Rating', f"{scores.get('overall', 0)}%"],
        ]
        
        score_table = Table(data, colWidths=[200, 100])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'), # Bold overall score
        ]))
        elements.append(score_table)
        elements.append(Spacer(1, 12))
        
        # 3. Executive Summary
        elements.append(Paragraph("Executive Summary", styles['SectionHeader']))
        elements.append(Paragraph(analysis.get('executiveSummary', '').replace('\n', '<br/>'), styles['Normal']))
        
        # 4. Analyst Reasoning
        elements.append(Paragraph("Investment Thesis & Reasoning", styles['SectionHeader']))
        elements.append(Paragraph(analysis.get('reasoning', '').replace('\n', '<br/>'), styles['Normal']))
        
        # 5. Metrics
        elements.append(Paragraph("Key Performance Indicators", styles['SectionHeader']))
        for metric in analysis.get('keyMetrics', []):
            elements.append(Paragraph(
                f"• <b>{metric.get('label')}</b>: {metric.get('value')} ({metric.get('benchmarkComparison')} Average)", 
                styles['Normal']
            ))
        
        # 6. Risks
        elements.append(Paragraph("Risk & Audit Assessment", styles['SectionHeader']))
        for risk in analysis.get('risks', []):
            elements.append(Paragraph(
                f"<b>[{risk.get('severity')}] {risk.get('category')}</b>: {risk.get('description')}", 
                styles['Normal']
            ))
            elements.append(Spacer(1, 6))
            
        # Build the PDF
        doc.build(elements)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes

pdf_service = PDFService()
