import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  convertInchesToTwip,
} from 'docx';

/**
 * 生成「二位心臟外科專科醫師判定」Word 文件
 * @param patientInfo 病患基本資料
 * @param summary AI 生成的摘要段落
 * @returns Document 物件
 */
export function createSurgeonAssessmentDocument(
  patientInfo: {
    name: string;
    chartNumber: string;
  },
  summary: string
): Document {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        children: [
          // 標題（3行）
          new Paragraph({
            text: '申請『經導管主動脈瓣膜置換術』',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 0,
              after: 100,
            },
            style: 'Title',
          }),
          new Paragraph({
            text: '必須至少二位心臟外科專科醫師判定無法以傳統開心手術進行主動脈瓣膜',
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 0,
              after: 0,
            },
          }),
          new Paragraph({
            text: '置換或開刀危險性過高',
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 0,
              after: 200,
            },
          }),

          // 副標題：TAVI 事前審查
          new Paragraph({
            text: 'TAVI 事前審查',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 200,
              after: 300,
            },
          }),

          // 摘要段落（AI 生成的內容）
          new Paragraph({
            children: [new TextRun({ text: summary, size: 24 })], // 12pt = 24 half-points
            spacing: {
              line: 360, // 1.5 倍行距
              before: 100,
              after: 400,
            },
            alignment: AlignmentType.JUSTIFIED, // 兩端對齊
          }),

          // 空行
          new Paragraph({
            text: '',
            spacing: { before: 400, after: 200 },
          }),

          // 第一位醫師簽名欄
          new Paragraph({
            children: [
              new TextRun({
                text: '第一位 心臟外科專科醫師____________________',
                size: 24,
              }),
              new TextRun({
                text: '       日期 __________',
                size: 24,
              }),
            ],
            spacing: {
              before: 200,
              after: 200,
            },
          }),

          // 空行
          new Paragraph({
            text: '',
            spacing: { before: 100, after: 100 },
          }),

          // 第二位醫師簽名欄
          new Paragraph({
            children: [
              new TextRun({
                text: '第二位 心臟外科專科醫師____________________',
                size: 24,
              }),
              new TextRun({
                text: '       日期 __________',
                size: 24,
              }),
            ],
            spacing: {
              before: 200,
              after: 200,
            },
          }),
        ],
      },
    ],
    styles: {
      paragraphStyles: [
        {
          id: 'Title',
          name: 'Title',
          basedOn: 'Normal',
          run: {
            size: 32, // 16pt
            bold: true,
            font: {
              name: '標楷體',
              eastAsia: '標楷體',
            },
          },
        },
      ],
      default: {
        document: {
          run: {
            font: {
              name: 'Times New Roman',
              eastAsia: '標楷體', // 中文使用標楷體
            },
            size: 24, // 12pt = 24 half-points
          },
          paragraph: {
            spacing: {
              line: 360, // 1.5 倍行距
            },
          },
        },
      },
    },
  });

  return doc;
}

/**
 * 生成檔案名稱
 * @param patientName 病患姓名
 * @param chartNumber 病歷號
 * @returns 檔案名稱（不含副檔名）
 */
export function generateFileName(
  patientName: string,
  chartNumber: string
): string {
  return `${patientName}${chartNumber} - 二位心臟外科專科醫師判定`;
}
