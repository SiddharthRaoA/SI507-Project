import json

class Node:
    def __init__(self, data):
        self.data = data
        self.children = []

    def add_child(self, child):
        self.children.append(child)


class Tree:
    def __init__(self):
        self.root = None
        self.json_dict = {}

    def add_root(self, root_node):
        self.root = root_node

    def traverse_tree(self, node):
        print(node.data)
        for child in node.children:
            self.traverse_tree(child)

    def find(self, node, to_find):
        if list(node.data.keys())[0] == to_find:
            return node
        else:
            for child in node.children:
                result = self.find(child, to_find)
                if result:
                    return result
        return None
                
    def to_dict(self, node):
        for child in node.children:
            if child.data != 'OTT':
                self.json_dict[f'{child.data}'] = [] 
                for child_of_child in child.children:
                    self.json_dict[f'{child.data}'].append(child_of_child.data)
            else:
                self.json_dict[f'{child.data}'] = {}
                for child_of_child in child.children:
                    self.json_dict[f'{child.data}'][f'{child_of_child.data}'] = []
                    for child_child_child in child_of_child.children:
                        self.json_dict[f'{child.data}'][f'{child_of_child.data}'].append(child_child_child.data)
        with open("data.json", "w") as file:
            json.dump(self.json_dict, file, indent=4)