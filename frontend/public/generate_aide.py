from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

OUTPUT = "C:/Jam/gestionmagasin/public/aide.pdf"

BLUE_DARK  = colors.HexColor("#1A3A5C")
BLUE_MED   = colors.HexColor("#2563A8")
BLUE_LIGHT = colors.HexColor("#D6E4F7")
GREY_LIGHT = colors.HexColor("#F4F6F9")
GREY_LINE  = colors.HexColor("#CBD5E1")

def build_styles():
    base = getSampleStyleSheet()

    styles = {}

    styles['doc_title'] = ParagraphStyle(
        'doc_title',
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=colors.white,
        alignment=TA_CENTER,
        spaceAfter=4,
    )
    styles['doc_subtitle'] = ParagraphStyle(
        'doc_subtitle',
        fontName='Helvetica',
        fontSize=12,
        textColor=colors.HexColor("#BDD7F5"),
        alignment=TA_CENTER,
        spaceAfter=0,
    )
    styles['section_title'] = ParagraphStyle(
        'section_title',
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=BLUE_DARK,
        spaceBefore=14,
        spaceAfter=6,
        leftIndent=0,
    )
    styles['body'] = ParagraphStyle(
        'body',
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=4,
        leading=15,
        alignment=TA_JUSTIFY,
    )
    styles['bullet'] = ParagraphStyle(
        'bullet',
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=3,
        leading=14,
        leftIndent=18,
        bulletIndent=6,
    )
    styles['sub_bullet'] = ParagraphStyle(
        'sub_bullet',
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor("#334155"),
        spaceAfter=2,
        leading=13,
        leftIndent=36,
        bulletIndent=22,
    )
    styles['label'] = ParagraphStyle(
        'label',
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=BLUE_MED,
        spaceAfter=2,
        leading=13,
        leftIndent=18,
    )
    styles['note'] = ParagraphStyle(
        'note',
        fontName='Helvetica-Oblique',
        fontSize=9,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=4,
        leading=13,
        leftIndent=18,
    )
    styles['footer'] = ParagraphStyle(
        'footer',
        fontName='Helvetica',
        fontSize=8,
        textColor=colors.HexColor("#94A3B8"),
        alignment=TA_CENTER,
    )
    return styles


def header_banner(canvas, doc):
    """Blue banner at top of every page."""
    w, h = A4
    banner_h = 3.2 * cm

    canvas.saveState()
    canvas.setFillColor(BLUE_DARK)
    canvas.rect(0, h - banner_h, w, banner_h, fill=1, stroke=0)

    # Thin accent line below banner
    canvas.setFillColor(BLUE_MED)
    canvas.rect(0, h - banner_h - 3, w, 3, fill=1, stroke=0)

    # App name in banner
    canvas.setFont("Helvetica-Bold", 15)
    canvas.setFillColor(colors.white)
    canvas.drawCentredString(w / 2, h - 1.6 * cm, "GestionMagasin")

    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(colors.HexColor("#BDD7F5"))
    canvas.drawCentredString(w / 2, h - 2.2 * cm, "Guide d'utilisation")

    # Footer
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#94A3B8"))
    canvas.drawCentredString(w / 2, 1.0 * cm, f"Page {doc.page}")
    canvas.line(2 * cm, 1.5 * cm, w - 2 * cm, 1.5 * cm)

    canvas.restoreState()


def section_header(text, number, styles):
    """Returns a table that acts as a coloured section heading."""
    data = [[Paragraph(f"{number}.  {text}", ParagraphStyle(
        'sh',
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.white,
        leading=16,
    ))]]
    t = Table(data, colWidths=[16.5 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BLUE_MED),
        ('TOPPADDING',    (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING',   (0, 0), (-1, -1), 12),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 8),
        ('ROUNDEDCORNERS', [4]),
    ]))
    return t


def info_table(rows, col_widths=None):
    """A simple two-column table for field descriptions."""
    if col_widths is None:
        col_widths = [5 * cm, 11 * cm]
    style = TableStyle([
        ('BACKGROUND',    (0, 0), (0, -1), BLUE_LIGHT),
        ('BACKGROUND',    (1, 0), (1, -1), GREY_LIGHT),
        ('FONTNAME',      (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME',      (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE',      (0, 0), (-1, -1), 9),
        ('TEXTCOLOR',     (0, 0), (0, -1), BLUE_DARK),
        ('TEXTCOLOR',     (1, 0), (1, -1), colors.HexColor("#1E293B")),
        ('TOPPADDING',    (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING',   (0, 0), (-1, -1), 8),
        ('GRID',          (0, 0), (-1, -1), 0.5, GREY_LINE),
        ('ROWBACKGROUNDS', (0, 0), (-1, -1), [GREY_LIGHT, colors.white]),
        ('VALIGN',        (0, 0), (-1, -1), 'TOP'),
    ])
    t = Table(rows, colWidths=col_widths)
    t.setStyle(style)
    return t


def column_table(headers, rows):
    """A multi-column display table."""
    n = len(headers)
    col_w = 16.5 * cm / n
    col_widths = [col_w] * n

    all_rows = [headers] + rows
    style = TableStyle([
        ('BACKGROUND',    (0, 0), (-1, 0), BLUE_DARK),
        ('TEXTCOLOR',     (0, 0), (-1, 0), colors.white),
        ('FONTNAME',      (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME',      (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE',      (0, 0), (-1, -1), 9),
        ('ALIGN',         (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING',    (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('GRID',          (0, 0), (-1, -1), 0.5, GREY_LINE),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [GREY_LIGHT, colors.white]),
        ('VALIGN',        (0, 0), (-1, -1), 'MIDDLE'),
    ])
    t = Table(all_rows, colWidths=col_widths)
    t.setStyle(style)
    return t


def build_story(styles):
    s = styles
    story = []

    # ── Cover spacer (banner is drawn by header_banner) ──────────────────────
    story.append(Spacer(1, 3.8 * cm))

    # Cover title block
    cover_title = Table(
        [[Paragraph("GestionMagasin", ParagraphStyle(
            'ct', fontName='Helvetica-Bold', fontSize=28,
            textColor=BLUE_DARK, alignment=TA_CENTER))],
         [Paragraph("Guide d'utilisation", ParagraphStyle(
            'cs', fontName='Helvetica', fontSize=16,
            textColor=BLUE_MED, alignment=TA_CENTER, spaceAfter=4))],
         [Paragraph("Application de gestion de magasin", ParagraphStyle(
            'cd', fontName='Helvetica-Oblique', fontSize=11,
            textColor=colors.HexColor("#64748B"), alignment=TA_CENTER))]],
        colWidths=[16.5 * cm]
    )
    cover_title.setStyle(TableStyle([
        ('BACKGROUND',    (0, 0), (-1, -1), BLUE_LIGHT),
        ('TOPPADDING',    (0, 0), (-1, -1), 14),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 14),
        ('LEFTPADDING',   (0, 0), (-1, -1), 20),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 20),
        ('LINEBELOW',     (0, -1), (-1, -1), 3, BLUE_MED),
    ]))
    story.append(cover_title)
    story.append(Spacer(1, 0.6 * cm))

    # Table of contents
    toc_rows = [
        ["1.", "Introduction"],
        ["2.", "Fenêtre Principale"],
        ["3.", "Affectation (Nouvelle Facture)"],
        ["4.", "Affectation par Employe (Recherche)"],
        ["5.", "Parcourir les Articles"],
        ["6.", "Choix Rapports (Etats)"],
        ["7.", "Deconnexion"],
    ]
    toc_data = []
    for num, title in toc_rows:
        toc_data.append([
            Paragraph(num, ParagraphStyle('tn', fontName='Helvetica-Bold',
                fontSize=10, textColor=BLUE_MED)),
            Paragraph(title, ParagraphStyle('tt', fontName='Helvetica',
                fontSize=10, textColor=BLUE_DARK)),
        ])

    toc_label = Paragraph("Table des matieres", ParagraphStyle(
        'tl', fontName='Helvetica-Bold', fontSize=11,
        textColor=BLUE_DARK, spaceAfter=6))
    story.append(toc_label)

    toc_t = Table(toc_data, colWidths=[1.2 * cm, 15.3 * cm])
    toc_t.setStyle(TableStyle([
        ('BACKGROUND',    (0, 0), (-1, -1), GREY_LIGHT),
        ('TOPPADDING',    (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING',   (0, 0), (-1, -1), 10),
        ('GRID',          (0, 0), (-1, -1), 0.3, GREY_LINE),
        ('ROWBACKGROUNDS', (0, 0), (-1, -1), [GREY_LIGHT, colors.white]),
    ]))
    story.append(toc_t)
    story.append(PageBreak())

    # ── SECTION 1 — Introduction ─────────────────────────────────────────────
    story.append(section_header("Introduction", 1, s))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(
        "GestionMagasin est une application de gestion de magasin permettant de gerer "
        "les affectations, les employes, les articles et les rapports de maniere simple "
        "et efficace.",
        s['body']))
    story.append(Paragraph(
        "L'application offre une interface conviviale pour suivre les transactions, "
        "gerer le personnel et generer des rapports detailles.",
        s['body']))
    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph("<b>Connexion :</b>", s['body']))
    story.append(info_table([
        ["Nom d'utilisateur", "Identifiant unique attribue a chaque utilisateur"],
        ["Mot de passe",       "Mot de passe confidentiel de l'utilisateur"],
    ]))
    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph(
        "Une connexion valide est requise pour acceder a toutes les fonctionnalites "
        "de l'application.",
        s['note']))

    story.append(Spacer(1, 0.5 * cm))

    # ── SECTION 2 — Fenetre Principale ───────────────────────────────────────
    story.append(section_header("Fenetre Principale", 2, s))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(
        "Apres connexion, la fenetre principale s'affiche avec les boutons de navigation "
        "principaux permettant d'acceder a toutes les fonctionnalites de l'application.",
        s['body']))
    story.append(Spacer(1, 0.2 * cm))

    btn_rows = [
        ["Nouvelle Facture", "Ouvre la fenetre de creation et gestion des affectations"],
        ["Recherche",        "Affiche la liste des employes et leurs affectations"],
        ["Articles",         "Parcourir et gerer le catalogue des articles disponibles"],
        ["Etats",            "Selectionner et generer les differents rapports"],
        ["Aide",             "Affiche ce guide d'utilisation"],
        ["Quitter",          "Ferme l'application"],
    ]
    story.append(column_table(["Bouton", "Description"], btn_rows))

    story.append(Spacer(1, 0.5 * cm))

    # ── SECTION 3 — Affectation ───────────────────────────────────────────────
    story.append(section_header("Affectation (Nouvelle Facture)", 3, s))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(
        "Cette fenetre permet de creer et de gerer les affectations. Elle affiche "
        "les informations du client et du vendeur, ainsi qu'un tableau des articles "
        "selectionnes.",
        s['body']))

    story.append(Spacer(1, 0.25 * cm))
    story.append(Paragraph("<b>Champs d'information :</b>", s['label']))
    story.append(info_table([
        ["Destinataire", "Nom du client ou du destinataire de la facture"],
        ["Cle",          "Identifiant unique de l'affectation (genere automatiquement)"],
        ["Date",         "Date de creation de l'affectation"],
        ["Fait par",     "Nom du vendeur responsable de l'affectation"],
    ]))

    story.append(Spacer(1, 0.25 * cm))
    story.append(Paragraph("<b>Tableau des articles (detail) :</b>", s['label']))
    art_cols = ["N article", "Description", "Prix U", "Quantite", "Total"]
    art_rows = [
        ["Numero unique", "Libelle de l'article", "Prix unitaire", "Quantite choisie", "Sous-total ligne"],
    ]
    story.append(column_table(art_cols, art_rows))
    story.append(Spacer(1, 0.1 * cm))
    story.append(Paragraph(
        "Le <b>Total General</b> est calcule et affiche automatiquement en bas du tableau.",
        s['note']))

    story.append(Spacer(1, 0.25 * cm))
    story.append(Paragraph("<b>Boutons de navigation :</b>", s['label']))
    nav_rows = [
        ["Premier",   "Affiche la premiere affectation enregistree"],
        ["Precedent", "Affiche l'affectation precedente"],
        ["Suivant",   "Affiche l'affectation suivante"],
        ["Dernier",   "Affiche la derniere affectation enregistree"],
    ]
    story.append(column_table(["Bouton", "Action"], nav_rows))

    story.append(Spacer(1, 0.25 * cm))
    story.append(Paragraph("<b>Boutons d'action :</b>", s['label']))
    action_rows = [
        ["Sauvegarder", "Enregistre l'affectation en cours dans la base de donnees"],
        ["Annuler",     "Annule les modifications non sauvegardees"],
        ["Fermer",      "Ferme la fenetre Nouvelle Facture"],
    ]
    story.append(column_table(["Bouton", "Action"], action_rows))

    story.append(Spacer(1, 0.5 * cm))

    # ── SECTION 4 — Recherche ─────────────────────────────────────────────────
    story.append(section_header("Affectation par Employe (Recherche)", 4, s))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(
        "Cette fenetre affiche la liste complete des employes avec un resume de leurs "
        "affectations. Elle permet de consulter le detail des affectations pour chaque "
        "employe et d'effectuer des recherches filtrees.",
        s['body']))

    story.append(Spacer(1, 0.25 * cm))
    story.append(Paragraph("<b>Colonnes — Liste des employes :</b>", s['label']))
    emp_cols = ["Cle Em", "Employe", "Telephone", "Derniere Aff"]
    emp_rows = [
        ["Identifiant", "Nom complet de l'employe", "No de telephone", "Date de la derniere affectation"],
    ]
    story.append(column_table(emp_cols, emp_rows))

    story.append(Spacer(1, 0.25 * cm))
    story.append(Paragraph("<b>Detail des affectations par employe :</b>", s['label']))
    det_cols = ["N Emp", "Date", "Date Effective", "Total"]
    det_rows = [
        ["Numero employe", "Date de creation", "Date d'effet", "Montant total"],
    ]
    story.append(column_table(det_cols, det_rows))

    story.append(Spacer(1, 0.25 * cm))
    story.append(Paragraph("<b>Boutons disponibles :</b>", s['label']))
    rech_rows = [
        ["Modifier",          "Ouvre l'affectation selectionnee pour modification"],
        ["Definir Requete",   "Permet de definir les criteres de filtrage"],
        ["Executer Requete",  "Lance la recherche selon les criteres definis"],
        ["Fermer",            "Ferme la fenetre Recherche"],
    ]
    story.append(column_table(["Bouton", "Action"], rech_rows))

    story.append(PageBreak())

    # ── SECTION 5 — Articles ──────────────────────────────────────────────────
    story.append(section_header("Parcourir les Articles", 5, s))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(
        "Cette fenetre liste tous les articles du catalogue. Elle permet de consulter "
        "les informations de disponibilite et d'effectuer des mises a jour du statut "
        "des articles.",
        s['body']))

    story.append(Spacer(1, 0.25 * cm))
    story.append(Paragraph("<b>Colonnes du tableau :</b>", s['label']))
    art_list_cols = ["Cle article", "Description", "Disponible", "OnOrder", "Indisponible"]
    art_list_rows = [
        ["Identifiant", "Libelle article", "Stock dispo.", "En commande", "Quantite indisponible"],
    ]
    story.append(column_table(art_list_cols, art_list_rows))

    story.append(Spacer(1, 0.25 * cm))
    story.append(Paragraph("<b>Boutons disponibles :</b>", s['label']))
    art_btn_rows = [
        ["Modifier",      "Ouvre la fiche de l'article selectionne pour modification"],
        ["Indisponible",  "Marque l'article selectionne comme indisponible"],
        ["Fermer",        "Ferme la fenetre Articles"],
    ]
    story.append(column_table(["Bouton", "Action"], art_btn_rows))

    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph(
        "Astuce : un double-clic sur un article dans la liste ouvre directement sa fiche "
        "de modification.",
        s['note']))

    story.append(Spacer(1, 0.5 * cm))

    # ── SECTION 6 — Etats ─────────────────────────────────────────────────────
    story.append(section_header("Choix Rapports (Etats)", 6, s))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(
        "Cette fenetre permet de generer trois types de rapports sur les donnees "
        "de l'application. Les rapports peuvent etre affiches a l'ecran ou imprimes "
        "directement.",
        s['body']))

    story.append(Spacer(1, 0.25 * cm))
    story.append(Paragraph("<b>Types de rapports disponibles :</b>", s['label']))
    rap_rows = [
        ["Etat Employes",          "Liste complete des employes avec leurs informations"],
        ["Etat des affectations",  "Recapitulatif de toutes les affectations effectuees"],
        ["Etat des Factures",      "Detail complet des factures emises"],
    ]
    story.append(column_table(["Rapport", "Description"], rap_rows))

    story.append(Spacer(1, 0.25 * cm))
    story.append(Paragraph("<b>Boutons d'action :</b>", s['label']))
    rap_btn_rows = [
        ["Imprimer", "Envoie le rapport selectionne vers l'imprimante"],
        ["Afficher", "Affiche le rapport selectionne dans une fenetre de visualisation"],
        ["Annuler",  "Ferme la fenetre Etats sans generer de rapport"],
    ]
    story.append(column_table(["Bouton", "Action"], rap_btn_rows))

    story.append(Spacer(1, 0.5 * cm))

    # ── SECTION 7 — Deconnexion ───────────────────────────────────────────────
    story.append(section_header("Deconnexion", 7, s))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(
        "Le bouton <b>Deconnexion</b> est accessible en permanence en haut a droite "
        "de la fenetre principale.",
        s['body']))
    story.append(Paragraph(
        "En cliquant sur ce bouton, la session utilisateur en cours est terminee et "
        "l'application retourne automatiquement a la page de connexion.",
        s['body']))
    story.append(Spacer(1, 0.25 * cm))
    story.append(info_table([
        ["Action",   "Cliquer sur le bouton Deconnexion (haut droite)"],
        ["Resultat", "Retour immediat a la page de connexion"],
        ["Note",     "Toute affectation non sauvegardee sera perdue. Pensez a sauvegarder avant de vous deconnecter."],
    ], col_widths=[4 * cm, 12 * cm]))

    story.append(Spacer(1, 0.6 * cm))
    story.append(HRFlowable(width="100%", thickness=1, color=GREY_LINE))
    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph(
        "GestionMagasin  —  Tous droits reserves  —  2026",
        s['footer']))

    return story


def main():
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        topMargin=3.8 * cm,
        bottomMargin=2.2 * cm,
        leftMargin=2.0 * cm,
        rightMargin=2.0 * cm,
        title="GestionMagasin — Guide d'utilisation",
        author="GestionMagasin",
        subject="Guide d'utilisation",
    )
    styles = build_styles()
    story = build_story(styles)
    doc.build(story, onFirstPage=header_banner, onLaterPages=header_banner)
    print(f"PDF genere : {OUTPUT}")


if __name__ == "__main__":
    main()
