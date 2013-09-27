package org.cote.pkglib.util;

import java.util.Comparator;

import org.cote.pkglib.objects.DocumentIndexType;

public class DocumentIndexComparator implements Comparator<DocumentIndexType> {
	public int compare(DocumentIndexType doc1, DocumentIndexType doc2){
		return doc1.getName().compareTo(doc2.getName());
	}
}