import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { type CommenEditor } from "@/features/dashboard/types";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code2,
  ImageIcon,
  LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const selection = editor.view.state.selection;
    const selectedText = editor.view.state.doc.textBetween(selection.from, selection.to, '');

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl || "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const finalUrl = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;

    if (selectedText) {
      // If text is selected, make it a link
      editor.chain().focus().extendMarkRange("link").setLink({ href: finalUrl }).run();
    } else {
      // If no text selected, insert the URL as both text and link
      editor.chain().focus().insertContent(`<a href="${finalUrl}">${finalUrl}</a>`).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter Image URL:", "");
    if (url) {
      const finalUrl = url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;

      editor.chain().focus().setImage({ src: finalUrl }).run();
    }
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/50 flex-wrap">
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bold") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("italic") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <Button
            key={level}
            type="button"
            size="sm"
            variant={editor.isActive("heading", { level }) ? "default" : "ghost"}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            className="min-w-[32px]"
          >
            H{level}
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("codeBlock") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("link") ? "default" : "ghost"}
          onClick={addLink}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={addImage}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default function CommentEditor({ onContentChange, commentHtml }: CommenEditor) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),

      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
        HTMLAttributes: {
          class: 'editor-heading',
        },
      }),

      BulletList.configure({
        itemTypeName: "listItem",
        keepMarks: true,
        HTMLAttributes: {
          class: 'editor-bullet-list',
        },
      }),

      OrderedList.configure({
        itemTypeName: "listItem",
        keepMarks: true,
        HTMLAttributes: {
          class: 'editor-ordered-list',
        },
      }),

      ListItem.configure({
        HTMLAttributes: {
          class: 'editor-list-item',
        },
      }),

      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),

      Image.configure({
        HTMLAttributes: {
          class: 'editor-image rounded-md max-w-full h-auto',
        },
      }),

      TextStyle,
      Color.configure({
        types: [TextStyle.name, ListItem.name]
      }),

      Placeholder.configure({
        placeholder: "What are your thoughts on...",
      }),
    ],
    content: commentHtml || "",
    onUpdate: ({ editor }) => {
      console.log('heh', editor.getHTML())
      onContentChange(editor.getHTML());

    },
  });

  useEffect(() => {
    if (editor && commentHtml && commentHtml !== editor.getHTML()) {
      editor.commands.setContent(commentHtml);
    }
  }, [commentHtml, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden bg-background">
      <MenuBar editor={editor} />

      <div className="flex-1 min-h-[200px]">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-4 focus-within:outline-none min-h-[200px] 
                     [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[180px] [&_.ProseMirror]:p-0
                     [&_.editor-heading]:font-bold [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h4]:text-base [&_h5]:text-sm
                     [&_.editor-bullet-list]:list-disc [&_.editor-bullet-list]:ml-6
                     [&_.editor-ordered-list]:list-decimal [&_.editor-ordered-list]:ml-6
                     [&_.editor-list-item]:mb-1"
        />
      </div>
    </div>
  );
}